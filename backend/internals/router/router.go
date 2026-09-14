// Package router wires every HTTP route to its handler and middleware.
package router

import (
	"net/http"

	"foliohub/internals/auth"
	"foliohub/internals/handlers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// New builds the fully-routed Gin engine.
func New(h *handlers.Handler, corsOrigins []string) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(gin.LoggerWithConfig(gin.LoggerConfig{SkipPaths: []string{"/healthz"}}))
	r.Use(cors(corsOrigins))

	r.GET("/healthz", h.Health)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("/api")
	{
		authGroup := api.Group("/auth")
		authGroup.POST("/register", h.Register)
		authGroup.POST("/login", h.Login)
		authGroup.GET("/me", auth.RequireAuth(h.JWT), h.Me)

		users := api.Group("/users")
		users.GET("/me", auth.RequireAuth(h.JWT), h.MeProfile)
		users.PATCH("/me", auth.RequireAuth(h.JWT), h.UpdateMe)
		users.GET("/:username", h.GetUserByUsername)
		users.GET("/:username/portfolios", auth.OptionalAuth(h.JWT), h.ListUserPortfolios)

		portfolios := api.Group("/portfolios")
		portfolios.GET("", auth.OptionalAuth(h.JWT), h.ListPortfolios)
		portfolios.POST("", auth.RequireAuth(h.JWT), h.CreatePortfolio)
		portfolios.GET("/:id", auth.OptionalAuth(h.JWT), h.GetPortfolio)
		portfolios.POST("/:id/versions", auth.RequireAuth(h.JWT), h.AddVersion)
		portfolios.POST("/:id/like", auth.RequireAuth(h.JWT), h.ToggleLike)
		portfolios.GET("/:id/comments", h.ListComments)
		portfolios.POST("/:id/comments", auth.RequireAuth(h.JWT), h.CreateComment)

		roasts := api.Group("/roasts")
		roasts.GET("", h.ListRoasts)
		roasts.POST("", auth.RequireAuth(h.JWT), h.CreateRoast)

		leaderboard := api.Group("/leaderboard")
		leaderboard.GET("", h.GetLeaderboard)
		leaderboard.GET("/top-stack", h.GetTopStack)

		notifications := api.Group("/notifications")
		notifications.GET("", auth.RequireAuth(h.JWT), h.ListNotifications)
		notifications.POST("/read-all", auth.RequireAuth(h.JWT), h.MarkAllNotificationsRead)

		aiGroup := api.Group("/ai")
		aiGroup.POST("/generate", auth.RequireAuth(h.JWT), h.GenerateAI)
		aiGroup.POST("/share", auth.RequireAuth(h.JWT), h.ShareAI)

		api.GET("/stats/summary", h.GetStatsSummary)
	}

	return r
}

func cors(allowedOrigins []string) gin.HandlerFunc {
	allowAll := len(allowedOrigins) == 1 && allowedOrigins[0] == "*"
	allowed := map[string]bool{}
	for _, o := range allowedOrigins {
		allowed[o] = true
	}
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if allowAll {
			c.Header("Access-Control-Allow-Origin", "*")
		} else if origin != "" && allowed[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
