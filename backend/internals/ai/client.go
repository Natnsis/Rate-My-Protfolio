// Package ai wraps an OpenAI-compatible chat-completions API (Groq) for AI Studio.
package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// ErrNotConfigured is returned when no API key has been set.
var ErrNotConfigured = errors.New("AI Studio is not configured yet — set GROQ_API_KEY on the server")

// DefaultBaseURL is the OpenAI-compatible Groq endpoint.
const DefaultBaseURL = "https://api.groq.com/openai/v1/chat/completions"

// Client calls an OpenAI-compatible chat-completions API.
type Client struct {
	apiKey          string
	model           string
	baseURL         string
	reasoningEffort string
	http            *http.Client
}

// New builds an AI Client. apiKey may be empty; calls will then fail with
// ErrNotConfigured instead of the server crashing or silently faking output.
func New(apiKey, model string) *Client {
	return NewWithBaseURL(apiKey, model, DefaultBaseURL)
}

// NewWithBaseURL builds an AI Client pinned to a specific chat-completions URL.
func NewWithBaseURL(apiKey, model, baseURL string) *Client {
	if baseURL == "" {
		baseURL = DefaultBaseURL
	}
	return &Client{
		apiKey:          apiKey,
		model:           model,
		baseURL:         baseURL,
		reasoningEffort: defaultReasoningEffort(model),
		http:            &http.Client{Timeout: 45 * time.Second},
	}
}

// defaultReasoningEffort caps hidden "thinking" tokens for reasoning models.
// Without a low cap the whole max_tokens budget can be spent reasoning,
// yielding an empty answer. Non-reasoning models must not receive the field.
func defaultReasoningEffort(model string) string {
	m := strings.ToLower(model)
	if strings.Contains(m, "gpt-oss") || strings.Contains(m, "qwen3") {
		return "low"
	}
	return ""
}

// Configured reports whether an API key is set.
func (c *Client) Configured() bool { return c.apiKey != "" }

type chatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type chatRequest struct {
	Model           string        `json:"model"`
	Messages        []chatMessage `json:"messages"`
	MaxTokens       int           `json:"max_tokens"`
	ReasoningEffort string        `json:"reasoning_effort,omitempty"`
}

type chatChoice struct {
	Message chatMessage `json:"message"`
}

type chatResponse struct {
	Choices []chatChoice `json:"choices"`
	Error   *struct {
		Message string `json:"message"`
	} `json:"error"`
}

// Generate sends a system + user prompt to the model and returns the reply text.
func (c *Client) Generate(ctx context.Context, systemPrompt, userPrompt string) (string, error) {
	if !c.Configured() {
		return "", ErrNotConfigured
	}

	reqBody, err := json.Marshal(chatRequest{
		Model: c.model,
		Messages: []chatMessage{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: userPrompt},
		},
		MaxTokens:       1024,
		ReasoningEffort: c.reasoningEffort,
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL, bytes.NewReader(reqBody))
	if err != nil {
		return "", err
	}
	req.Header.Set("content-type", "application/json")
	req.Header.Set("authorization", "Bearer "+c.apiKey)

	resp, err := c.http.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var parsed chatResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("unexpected AI response: %s", string(body))
	}
	if parsed.Error != nil {
		return "", fmt.Errorf("AI provider error: %s", parsed.Error.Message)
	}
	if resp.StatusCode != http.StatusOK || len(parsed.Choices) == 0 {
		return "", fmt.Errorf("AI provider returned status %d", resp.StatusCode)
	}

	out := parsed.Choices[0].Message.Content
	if out == "" {
		return "", errors.New("AI provider returned an empty response")
	}
	return out, nil
}