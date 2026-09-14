// Package handlers implements every HTTP endpoint of the FolioHub API.
package handlers

import (
	"net/http"

	"foliohub/internals/ai"
	"foliohub/internals/auth"
	"foliohub/internals/config"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Handler bundles the dependencies every endpoint needs.
type Handler struct {
	DB  *gorm.DB
	JWT *auth.Manager
	Cfg config.Config
	AI  *ai.Client
}

// New builds a Handler.
func New(db *gorm.DB, jwt *auth.Manager, cfg config.Config, aiClient *ai.Client) *Handler {
	return &Handler{DB: db, JWT: jwt, Cfg: cfg, AI: aiClient}
}

func fail(c *gin.Context, status int, msg string) {
	c.AbortWithStatusJSON(status, gin.H{"error": msg})
}

func failErr(c *gin.Context, status int, err error) {
	fail(c, status, err.Error())
}

// currentUserID reads the authenticated caller set by auth middleware.
func currentUserID(c *gin.Context) uint {
	id, _ := auth.UserID(c)
	return id
}

// Health reports service liveness.
//
//	@Summary		Health check
//	@Tags			meta
//	@Produce		json
//	@Success		200	{object}	map[string]string
//	@Router			/healthz [get]
func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
