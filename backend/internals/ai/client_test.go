package ai

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// fakeProvider starts a scripted OpenAI-compatible server and captures the
// request body the client sends into a builder, for assertions after Generate.
func fakeProvider(t *testing.T, handler http.HandlerFunc) (*Client, *strings.Builder) {
	t.Helper()
	capture := &strings.Builder{}
	inner := handler
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		b, _ := io.ReadAll(r.Body)
		capture.Write(b)
		inner(w, r)
	}))
	t.Cleanup(srv.Close)
	return NewWithBaseURL("test-key", "openai/gpt-oss-120b", srv.URL), capture
}

func okBody(text string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("content-type", "application/json")
		_ = json.NewEncoder(w).Encode(chatResponse{
			Choices: []chatChoice{{Message: chatMessage{Role: "assistant", Content: text}}},
		})
	}
}

func TestGenerateSuccess(t *testing.T) {
	client, capture := fakeProvider(t, okBody("sharp roast here"))

	got, err := client.Generate(context.Background(), "system prompt", "user prompt")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got != "sharp roast here" {
		t.Errorf("got %q, want %q", got, "sharp roast here")
	}

	var sent chatRequest
	if err := json.Unmarshal([]byte(capture.String()), &sent); err != nil {
		t.Fatalf("captured body is not valid JSON: %v", err)
	}
	if sent.Model != "openai/gpt-oss-120b" {
		t.Errorf("model = %q, want openai/gpt-oss-120b", sent.Model)
	}
	if sent.MaxTokens != 1024 {
		t.Errorf("max_tokens = %d, want 1024", sent.MaxTokens)
	}
	if sent.ReasoningEffort != "low" {
		t.Errorf("reasoning_effort = %q, want low", sent.ReasoningEffort)
	}
	if len(sent.Messages) != 2 {
		t.Fatalf("messages = %d, want 2 (system + user)", len(sent.Messages))
	}
	if sent.Messages[0].Role != "system" || sent.Messages[1].Role != "user" {
		t.Errorf("message roles = [%q %q], want [system user]", sent.Messages[0].Role, sent.Messages[1].Role)
	}
}

func TestGenerateNotConfigured(t *testing.T) {
	client := New("", "test-model")
	if client.Configured() {
		t.Fatal("Configured() = true with empty key")
	}
	_, err := client.Generate(context.Background(), "s", "u")
	if err != ErrNotConfigured {
		t.Fatalf("err = %v, want ErrNotConfigured", err)
	}
}

func TestGenerateProviderError(t *testing.T) {
	client, _ := fakeProvider(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		_, _ = w.Write([]byte(`{"error":{"message":"model not found"}}`))
	})
	_, err := client.Generate(context.Background(), "s", "u")
	if err == nil || !strings.Contains(err.Error(), "model not found") {
		t.Fatalf("err = %v, want provider error naming %q", err, "model not found")
	}
}

func TestGenerateEmptyContent(t *testing.T) {
	client, _ := fakeProvider(t, okBody(""))
	_, err := client.Generate(context.Background(), "s", "u")
	if err == nil || !strings.Contains(err.Error(), "empty") {
		t.Fatalf("err = %v, want empty-response error", err)
	}
}

func TestGenerateNonOKStatus(t *testing.T) {
	client, _ := fakeProvider(t, func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte(`unexpected`))
	})
	_, err := client.Generate(context.Background(), "s", "u")
	if err == nil {
		t.Fatal("expected error for 500 status")
	}
}

func TestDefaultReasoningEffortGating(t *testing.T) {
	cases := map[string]string{
		"openai/gpt-oss-120b":     "low",
		"qwen/qwen3.8-27b":        "low",
		"llama-3.3-70b-versatile": "",
	}
	for model, want := range cases {
		if got := defaultReasoningEffort(model); got != want {
			t.Errorf("defaultReasoningEffort(%q) = %q, want %q", model, got, want)
		}
	}
}