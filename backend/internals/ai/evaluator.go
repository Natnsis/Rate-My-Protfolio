package ai

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

// Scores is the structured evaluation returned for a portfolio version.
type Scores struct {
	UI   float64 `json:"ui"`
	UX   float64 `json:"ux"`
	Code float64 `json:"code"`
}

// Evaluate scores a portfolio using the same experienced-reviewer model as AI Studio.
// The model receives the submitted URL and author notes; it must return only JSON.
func (c *Client) Evaluate(ctx context.Context, title, projectURL, tags, note string) (Scores, error) {
	const systemPrompt = `You are a senior product designer and software engineer evaluating a developer portfolio submission. Score the submitted work fairly and conservatively from 0 to 10 in three independent dimensions: ui (visual craft, hierarchy, typography and consistency), ux (clarity, usability, accessibility and flow), and code (engineering quality inferred from the project context and write-up). Do not invent evidence. Return ONLY one valid JSON object with exactly these numeric keys: {"ui": number, "ux": number, "code": number}. Use one decimal place. No markdown, explanation, or extra keys.`
	userPrompt := fmt.Sprintf("Portfolio: %s\nProject URL: %s\nTags: %s\nAuthor's version notes: %s", title, projectURL, tags, note)
	raw, err := c.Generate(ctx, systemPrompt, userPrompt)
	if err != nil {
		return Scores{}, err
	}

	start, end := strings.IndexByte(raw, '{'), strings.LastIndexByte(raw, '}')
	if start < 0 || end <= start {
		return Scores{}, errors.New("AI evaluator returned no JSON object")
	}
	var scores Scores
	decoder := json.NewDecoder(strings.NewReader(raw[start : end+1]))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&scores); err != nil {
		return Scores{}, fmt.Errorf("invalid AI evaluation JSON: %w", err)
	}
	if scores.UI < 0 || scores.UI > 10 || scores.UX < 0 || scores.UX > 10 || scores.Code < 0 || scores.Code > 10 {
		return Scores{}, errors.New("AI evaluator returned scores outside 0-10")
	}
	return scores, nil
}
