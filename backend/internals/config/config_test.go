package config

import (
	"os"
	"testing"
	"time"
)

func withEnv(t *testing.T, set map[string]string, unset []string, fn func()) {
	t.Helper()
	for k, v := range set {
		if err := os.Setenv(k, v); err != nil {
			t.Fatalf("Setenv(%s) error: %v", k, err)
		}
	}
	for _, k := range unset {
		if err := os.Unsetenv(k); err != nil {
			t.Fatalf("Unsetenv(%s) error: %v", k, err)
		}
	}
	t.Cleanup(func() {
		for k := range set {
			_ = os.Unsetenv(k)
		}
	})
	fn()
}

func TestLoadDefaults(t *testing.T) {
	withEnv(t, nil, []string{"PORT", "DATABASE_URL", "JWT_SECRET", "JWT_EXPIRY_HOURS", "CORS_ORIGINS", "GROQ_API_KEY", "AI_MODEL", "APP_ENV"}, func() {
		cfg := Load()
		if cfg.Port != "8080" {
			t.Errorf("Port = %q, want 8080", cfg.Port)
		}
		if !cfg.DatabaseIsStub {
			t.Error("DatabaseIsStub = false with placeholder URL, want true")
		}
		if !cfg.JWTSecretIsDev {
			t.Error("JWTSecretIsDev = false with dev fallback secret, want true")
		}
		if cfg.JWTExpiry != 7*24*time.Hour {
			t.Errorf("JWTExpiry = %v, want 168h", cfg.JWTExpiry)
		}
		if cfg.GroqKey != "" {
			t.Errorf("GroqKey = %q, want empty", cfg.GroqKey)
		}
		if cfg.AIModel != "openai/gpt-oss-120b" {
			t.Errorf("AIModel = %q, want openai/gpt-oss-120b", cfg.AIModel)
		}
		if len(cfg.CORSOrigins) != 4 {
			t.Errorf("CORSOrigins = %v, want 4 defaults", cfg.CORSOrigins)
		}
	})
}

func TestLoadCustom(t *testing.T) {
	withEnv(t, map[string]string{
		"PORT":              "9000",
		"DATABASE_URL":      "postgres://user:pass@example/foliohub",
		"JWT_SECRET":        "a-very-long-real-secret",
		"JWT_EXPIRY_HOURS":  "2",
		"CORS_ORIGINS":      " https://devfolio.dev , https://www.devfolio.dev ",
		"GROQ_API_KEY":      "gsk_test",
		"AI_MODEL":          "qwen/qwen3.8-27b",
		"APP_ENV":           "production",
	}, nil, func() {
		cfg := Load()
		if cfg.Port != "9000" {
			t.Errorf("Port = %q, want 9000", cfg.Port)
		}
		if cfg.DatabaseIsStub {
			t.Error("DatabaseIsStub = true with real URL, want false")
		}
		if cfg.JWTSecretIsDev {
			t.Error("JWTSecretIsDev = true with custom secret, want false")
		}
		if cfg.JWTExpiry != 2*time.Hour {
			t.Errorf("JWTExpiry = %v, want 2h", cfg.JWTExpiry)
		}
		if len(cfg.CORSOrigins) != 2 || cfg.CORSOrigins[0] != "https://devfolio.dev" {
			t.Errorf("CORSOrigins = %v, want trimmed pair", cfg.CORSOrigins)
		}
		if cfg.GroqKey != "gsk_test" {
			t.Errorf("GroqKey = %q, want gsk_test", cfg.GroqKey)
		}
		if cfg.AIModel != "qwen/qwen3.8-27b" {
			t.Errorf("AIModel = %q, want qwen/qwen3.8-27b", cfg.AIModel)
		}
		if !cfg.IsProduction {
			t.Error("IsProduction = false in production env, want true")
		}
	})
}

func TestLoadIgnoresEmptyString(t *testing.T) {
	withEnv(t, map[string]string{
		"JWT_EXPIRY_HOURS": "",
	}, nil, func() {
		cfg := Load()
		if cfg.JWTExpiry != 7*24*time.Hour {
			t.Errorf("JWTExpiry = %v with empty env, want 168h fallback", cfg.JWTExpiry)
		}
	})
}