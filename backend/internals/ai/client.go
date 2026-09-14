// Package ai wraps calls to the Anthropic Messages API for AI Studio.
package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

// ErrNotConfigured is returned when no API key has been set.
var ErrNotConfigured = errors.New("AI Studio is not configured yet — set ANTHROPIC_API_KEY on the server")

// Client calls the Anthropic Messages API.
type Client struct {
	apiKey string
	model  string
	http   *http.Client
}

// New builds an AI Client. apiKey may be empty; calls will then fail with
// ErrNotConfigured instead of the server crashing or silently faking output.
func New(apiKey, model string) *Client {
	return &Client{apiKey: apiKey, model: model, http: &http.Client{Timeout: 30 * time.Second}}
}

// Configured reports whether an API key is set.
func (c *Client) Configured() bool { return c.apiKey != "" }

type messageContent struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type messagesRequest struct {
	Model     string           `json:"model"`
	MaxTokens int              `json:"max_tokens"`
	System    string           `json:"system"`
	Messages  []messagePayload `json:"messages"`
}

type messagePayload struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type messagesResponse struct {
	Content []messageContent `json:"content"`
	Error   *struct {
		Message string `json:"message"`
	} `json:"error"`
}

// Generate sends a system + user prompt to Claude and returns the reply text.
func (c *Client) Generate(ctx context.Context, systemPrompt, userPrompt string) (string, error) {
	if !c.Configured() {
		return "", ErrNotConfigured
	}

	reqBody, err := json.Marshal(messagesRequest{
		Model:     c.model,
		MaxTokens: 500,
		System:    systemPrompt,
		Messages:  []messagePayload{{Role: "user", Content: userPrompt}},
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.anthropic.com/v1/messages", bytes.NewReader(reqBody))
	if err != nil {
		return "", err
	}
	req.Header.Set("content-type", "application/json")
	req.Header.Set("x-api-key", c.apiKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	resp, err := c.http.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var parsed messagesResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("unexpected AI response: %s", string(body))
	}
	if parsed.Error != nil {
		return "", fmt.Errorf("AI provider error: %s", parsed.Error.Message)
	}
	if resp.StatusCode != http.StatusOK || len(parsed.Content) == 0 {
		return "", fmt.Errorf("AI provider returned status %d", resp.StatusCode)
	}

	var out string
	for _, block := range parsed.Content {
		if block.Type == "text" {
			out += block.Text
		}
	}
	if out == "" {
		return "", errors.New("AI provider returned an empty response")
	}
	return out, nil
}
