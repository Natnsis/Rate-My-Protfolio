package handlers

import (
	"errors"
	"net/http"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type likeResponse struct {
	Liked     bool  `json:"liked"`
	LikeCount int64 `json:"likeCount"`
}

// ToggleLike likes a portfolio if the caller hasn't already, otherwise unlikes it.
//
//	@Summary		Like or unlike a portfolio
//	@Tags			portfolios
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		int	true	"Portfolio ID"
//	@Success		200	{object}	likeResponse
//	@Router			/portfolios/{id}/like [post]
func (h *Handler) ToggleLike(c *gin.Context) {
	var p db.Portfolio
	if err := h.DB.First(&p, c.Param("id")).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}
	userID := currentUserID(c)

	var existing db.Like
	err := h.DB.Where("user_id = ? AND portfolio_id = ?", userID, p.ID).First(&existing).Error
	liked := false
	switch {
	case err == nil:
		h.DB.Delete(&existing)
	case errors.Is(err, gorm.ErrRecordNotFound):
		h.DB.Create(&db.Like{UserID: userID, PortfolioID: p.ID})
		liked = true
		if p.UserID != userID {
			h.notify(p.UserID, userID, "like", "liked your version “"+latestVersionLabel(h.DB, p.ID)+"”.", &p.ID)
		}
	default:
		failErr(c, http.StatusInternalServerError, err)
		return
	}

	var count int64
	h.DB.Model(&db.Like{}).Where("portfolio_id = ?", p.ID).Count(&count)
	c.JSON(http.StatusOK, likeResponse{Liked: liked, LikeCount: count})
}

func latestVersionLabel(gdb *gorm.DB, portfolioID uint) string {
	var v db.Version
	if err := gdb.Where("portfolio_id = ?", portfolioID).Order("number DESC").First(&v).Error; err != nil {
		return "?"
	}
	return versionLabel(v.Number)
}
