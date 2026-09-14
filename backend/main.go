// FolioHub API
//
//	@title			FolioHub API
//	@version		1.0
//	@description	REST API powering the DevFolio frontend — auth, portfolios, versions, likes, comments, roasts, leaderboard, notifications and AI Studio.
//	@BasePath		/api
//
//	@securityDefinitions.apikey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Type "Bearer" followed by a space and your JWT.
package main

import (
	"log"

	_ "foliohub/docs"
	"foliohub/internals/ai"
	"foliohub/internals/auth"
	"foliohub/internals/config"
	"foliohub/internals/db"
	"foliohub/internals/handlers"
	"foliohub/internals/router"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("[config] no .env file found — reading configuration from the environment")
	}

	cfg := config.Load()

	if cfg.JWTSecretIsDev {
		log.Println("[config] WARNING: using the default JWT_SECRET — set a real one before deploying")
	}
	if cfg.DatabaseIsStub {
		log.Println("[config] WARNING: DATABASE_URL is a placeholder — set it to your Neon connection string in backend/.env")
	}
	if cfg.AnthropicKey == "" {
		log.Println("[config] ANTHROPIC_API_KEY not set — AI Studio will respond with 503 until it is")
	}

	gormDB, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("[db] failed to connect: %v\nSet DATABASE_URL in backend/.env to your Neon connection string.", err)
	}

	jwtManager := auth.NewManager(cfg.JWTSecret, cfg.JWTExpiry)
	aiClient := ai.New(cfg.AnthropicKey, cfg.AIModel)
	h := handlers.New(gormDB, jwtManager, cfg, aiClient)

	engine := router.New(h, cfg.CORSOrigins)

	log.Printf("[server] FolioHub API listening on :%s (swagger at /swagger/index.html)", cfg.Port)
	if err := engine.Run(":" + cfg.Port); err != nil {
		log.Fatalf("[server] failed to start: %v", err)
	}
}
