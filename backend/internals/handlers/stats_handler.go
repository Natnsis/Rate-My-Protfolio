package handlers

import (
	"net/http"
	"time"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
)

// StatsSummary is small platform-wide counters shown on the Feed page.
type StatsSummary struct {
	VersionsToday int64 `json:"versionsToday"`
}

// GetStatsSummary returns lightweight platform activity counters.
//
//	@Summary		Platform activity summary
//	@Tags			meta
//	@Produce		json
//	@Success		200	{object}	StatsSummary
//	@Router			/stats/summary [get]
func (h *Handler) GetStatsSummary(c *gin.Context) {
	var count int64
	h.DB.Model(&db.Version{}).Where("created_at >= ?", time.Now().Add(-24*time.Hour)).Count(&count)
	c.JSON(http.StatusOK, StatsSummary{VersionsToday: count})
}
