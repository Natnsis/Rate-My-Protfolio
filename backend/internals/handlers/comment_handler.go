package handlers

import (
	"net/http"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
)

// CommentDTO is a Comment shaped for the wire.
type CommentDTO struct {
	ID        uint       `json:"id"`
	Text      string     `json:"text"`
	CreatedAt string     `json:"createdAt"`
	User      UserPublic `json:"user"`
}

// ListComments lists every comment on a portfolio, oldest first.
//
//	@Summary		List a portfolio's comments
//	@Tags			comments
//	@Produce		json
//	@Param			id	path		int	true	"Portfolio ID"
//	@Success		200	{array}		CommentDTO
//	@Router			/portfolios/{id}/comments [get]
func (h *Handler) ListComments(c *gin.Context) {
	var comments []db.Comment
	h.DB.Preload("User").Where("portfolio_id = ?", c.Param("id")).Order("created_at ASC").Find(&comments)
	out := make([]CommentDTO, 0, len(comments))
	for _, cm := range comments {
		out = append(out, CommentDTO{ID: cm.ID, Text: cm.Text, CreatedAt: cm.CreatedAt.Format("2006-01-02T15:04:05Z07:00"), User: toUserPublic(cm.User)})
	}
	c.JSON(http.StatusOK, out)
}

type createCommentRequest struct {
	Text string `json:"text" binding:"required"`
}

// CreateComment leaves feedback on a portfolio's current version.
//
//	@Summary		Comment on a portfolio
//	@Tags			comments
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id		path		int						true	"Portfolio ID"
//	@Param			body	body		createCommentRequest	true	"Comment text"
//	@Success		201		{object}	CommentDTO
//	@Router			/portfolios/{id}/comments [post]
func (h *Handler) CreateComment(c *gin.Context) {
	var p db.Portfolio
	if err := h.DB.First(&p, c.Param("id")).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}
	var req createCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}

	userID := currentUserID(c)
	comment := db.Comment{PortfolioID: p.ID, UserID: userID, Text: req.Text}
	if err := h.DB.Create(&comment).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	h.DB.Preload("User").First(&comment, comment.ID)

	if p.UserID != userID {
		h.notify(p.UserID, userID, "comment", "commented on your version “"+latestVersionLabel(h.DB, p.ID)+"”.", &p.ID)
	}

	c.JSON(http.StatusCreated, CommentDTO{ID: comment.ID, Text: comment.Text, CreatedAt: comment.CreatedAt.Format("2006-01-02T15:04:05Z07:00"), User: toUserPublic(comment.User)})
}
