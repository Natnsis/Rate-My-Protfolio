// Package config centralizes environment-driven configuration for the
// FolioHub API server so every other package reads settings from one place.
package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// placeholderDBURL is a syntactically valid but non-functional Neon
// connection string. It lets the server boot its config/routes for local
// development before a real Neon database has been provisioned.
const placeholderDBURL = "postgres://username:password@ep-placeholder.us-east-2.aws.neon.tech/foliohub?sslmode=require"

// Config holds every runtime setting the server needs.
type Config struct {
	Port           string
	DatabaseURL    string
	DatabaseIsStub bool
	JWTSecret      string
	JWTExpiry      time.Duration
	CORSOrigins    []string
	AnthropicKey   string
	AIModel        string
	IsProduction   bool
	JWTSecretIsDev bool
}

// Load reads configuration from environment variables, falling back to
// sensible local-development defaults so the server runs out of the box.
func Load() Config {
	cfg := Config{
		Port:         getEnv("PORT", "8080"),
		DatabaseURL:  getEnv("DATABASE_URL", placeholderDBURL),
		JWTSecret:    getEnv("JWT_SECRET", "devfolio-dev-secret-change-me"),
		AnthropicKey: os.Getenv("ANTHROPIC_API_KEY"),
		AIModel:      getEnv("AI_MODEL", "claude-sonnet-5"),
		IsProduction: getEnv("APP_ENV", "development") == "production",
	}

	cfg.DatabaseIsStub = cfg.DatabaseURL == placeholderDBURL

	cfg.JWTSecretIsDev = cfg.JWTSecret == "devfolio-dev-secret-change-me"

	if hours, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "168")); err == nil {
		cfg.JWTExpiry = time.Duration(hours) * time.Hour
	} else {
		cfg.JWTExpiry = 7 * 24 * time.Hour
	}

	origins := getEnv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
	for _, o := range strings.Split(origins, ",") {
		o = strings.TrimSpace(o)
		if o != "" {
			cfg.CORSOrigins = append(cfg.CORSOrigins, o)
		}
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}
