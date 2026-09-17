package handlers

import (
	"net/http"
	"strconv"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
)

// NotificationDTO is a Notification shaped for the wire.
type NotificationDTO struct {
	ID        uint        `json:"id"`
	Kind      string      `json:"kind"`
	Message   string      `json:"message"`
	Read      bool        `json:"read"`
	CreatedAt string      `json:"createdAt"`
	Actor     *UserPublic `json:"actor,omitempty"`
	Portfolio *struct {
		ID    uint   `json:"id"`
		Title string `json:"title"`
	} `json:"portfolio,omitempty"`
}

// notify writes a Notification row for recipientID, unless the recipient is
// the actor themselves (no need to notify yourself).
func (h *Handler) notify(recipientID, actorID uint, kind, message string, portfolioID *uint) {
	if recipientID == actorID {
		return
	}
	actor := actorID
	h.DB.Create(&db.Notification{UserID: recipientID, ActorID: &actor, Kind: kind, Message: message, PortfolioID: portfolioID})
}

// ListNotifications lists the authenticated user's notifications, newest first.
//
//	@Summary		List my notifications
//	@Tags			notifications
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{array}	NotificationDTO
//	@Router			/notifications [get]
func (h *Handler) ListNotifications(c *gin.Context) {
	var notifs []db.Notification
	h.DB.Preload("Actor").Where("user_id = ?", currentUserID(c)).Order("created_at DESC").Limit(100).Find(&notifs)

	portfolioIDs := []uint{}
	for _, n := range notifs {
		if n.PortfolioID != nil {
			portfolioIDs = append(portfolioIDs, *n.PortfolioID)
		}
	}
	titles := map[uint]string{}
	if len(portfolioIDs) > 0 {
		var portfolios []db.Portfolio
		h.DB.Where("id IN ?", portfolioIDs).Find(&portfolios)
		for _, p := range portfolios {
			titles[p.ID] = p.Title
		}
	}

	out := make([]NotificationDTO, 0, len(notifs))
	for _, n := range notifs {
		dto := NotificationDTO{ID: n.ID, Kind: n.Kind, Message: n.Message, Read: n.Read, CreatedAt: n.CreatedAt.Format("2006-01-02T15:04:05Z07:00")}
		if n.Actor != nil {
			actor := toUserPublic(*n.Actor)
			dto.Actor = &actor
		}
		if n.PortfolioID != nil {
			dto.Portfolio = &struct {
				ID    uint   `json:"id"`
				Title string `json:"title"`
			}{ID: *n.PortfolioID, Title: titles[*n.PortfolioID]}
		}
		out = append(out, dto)
	}
	c.JSON(http.StatusOK, out)
}

// MarkNotificationRead marks one of the caller's notifications as read.
// A notification belonging to another user is deliberately indistinguishable
// from a missing notification.
//
//	@Summary		Mark one notification read
//	@Tags			notifications
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path	int	true	"Notification ID"
//	@Success		204	"no content"
//	@Router			/notifications/{id}/read [post]
func (h *Handler) MarkNotificationRead(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		fail(c, http.StatusNotFound, "notification not found")
		return
	}

	result := h.DB.Model(&db.Notification{}).
		Where("id = ? AND user_id = ?", uint(id), currentUserID(c)).
		Update("read", true)
	if result.Error != nil {
		failErr(c, http.StatusInternalServerError, result.Error)
		return
	}
	if result.RowsAffected == 0 {
		fail(c, http.StatusNotFound, "notification not found")
		return
	}
	c.Status(http.StatusNoContent)
}

// MarkAllNotificationsRead marks every notification for the caller as read.
//
//	@Summary		Mark all notifications read
//	@Tags			notifications
//	@Produce		json
//	@Security		BearerAuth
//	@Success		204	"no content"
//	@Router			/notifications/read-all [post]
func (h *Handler) MarkAllNotificationsRead(c *gin.Context) {
	h.DB.Model(&db.Notification{}).Where("user_id = ? AND read = ?", currentUserID(c), false).Update("read", true)
	c.Status(http.StatusNoContent)
}
