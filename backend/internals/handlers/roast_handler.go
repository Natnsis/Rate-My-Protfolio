package handlers

import (
	"net/http"
	"sort"
	"strings"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RoastDTO is a Roast shaped for the wire.
type RoastDTO struct {
	ID          uint       `json:"id"`
	Title       string     `json:"title"`
	Body        string     `json:"body"`
	Stars       int        `json:"stars"`
	Helpful     int        `json:"helpful"`
	AIGenerated bool       `json:"aiGenerated"`
	CreatedAt   string     `json:"createdAt"`
	User        UserPublic `json:"user"`
	Portfolio   struct {
		ID            uint   `json:"id"`
		Title         string `json:"title"`
		ScreenshotURL string `json:"screenshotUrl"`
	} `json:"portfolio"`
}

func toRoastDTO(r db.Roast, screenshot string) RoastDTO {
	dto := RoastDTO{
		ID: r.ID, Title: r.Title, Body: r.Body, Stars: r.Stars, Helpful: r.Helpful,
		AIGenerated: r.AIGenerated, CreatedAt: r.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		User: toUserPublic(r.User),
	}
	dto.Portfolio.ID = r.PortfolioID
	dto.Portfolio.Title = r.Portfolio.Title
	dto.Portfolio.ScreenshotURL = screenshot
	return dto
}

// ListRoasts lists the Community Roasts feed.
//
//	@Summary		List community roasts
//	@Tags			roasts
//	@Produce		json
//	@Param			sort	query		string	false	"top | new"
//	@Param			limit	query		int		false	"Max results (default 30)"
//	@Success		200		{array}		RoastDTO
//	@Router			/roasts [get]
func (h *Handler) ListRoasts(c *gin.Context) {
	var roasts []db.Roast
	h.DB.Preload("User").Preload("Portfolio").Order("created_at DESC").Find(&roasts)

	screenshots := map[uint]string{}
	for _, r := range roasts {
		if _, ok := screenshots[r.PortfolioID]; !ok {
			screenshots[r.PortfolioID] = latestScreenshot(h.DB, r.PortfolioID)
		}
	}

	if strings.EqualFold(c.DefaultQuery("sort", "top"), "top") {
		sort.Slice(roasts, func(i, j int) bool { return roasts[i].Helpful > roasts[j].Helpful })
	}

	limit := queryInt(c, "limit", 30)
	if limit > len(roasts) {
		limit = len(roasts)
	}
	out := make([]RoastDTO, 0, limit)
	for _, r := range roasts[:limit] {
		out = append(out, toRoastDTO(r, screenshots[r.PortfolioID]))
	}
	c.JSON(http.StatusOK, out)
}

func latestScreenshot(gdb *gorm.DB, portfolioID uint) string {
	var v db.Version
	if err := gdb.Where("portfolio_id = ?", portfolioID).Order("number DESC").First(&v).Error; err != nil {
		return ""
	}
	return v.ScreenshotURL
}

type createRoastRequest struct {
	PortfolioID uint   `json:"portfolioId" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Body        string `json:"body" binding:"required"`
	Stars       int    `json:"stars" binding:"min=0,max=5"`
}

// CreateRoast posts a structured review to the Community Roasts feed.
//
//	@Summary		Post a roast
//	@Tags			roasts
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			body	body		createRoastRequest	true	"Roast content"
//	@Success		201		{object}	RoastDTO
//	@Router			/roasts [post]
func (h *Handler) CreateRoast(c *gin.Context) {
	var req createRoastRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	var p db.Portfolio
	if err := h.DB.First(&p, req.PortfolioID).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}

	userID := currentUserID(c)
	roast := db.Roast{PortfolioID: p.ID, UserID: userID, Title: req.Title, Body: req.Body, Stars: req.Stars}
	if err := h.DB.Create(&roast).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	h.DB.Preload("User").Preload("Portfolio").First(&roast, roast.ID)

	if p.UserID != userID {
		h.notify(p.UserID, userID, "roast", "posted a roast on “"+p.Title+"”.", &p.ID)
	}
	c.JSON(http.StatusCreated, toRoastDTO(roast, latestScreenshot(h.DB, p.ID)))
}
