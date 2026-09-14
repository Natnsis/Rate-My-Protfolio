package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"foliohub/internals/ai"
	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
)

var aiModePrompts = map[string]struct {
	system string
	title  string
}{
	"roast": {
		system: "You are a witty, brutally honest senior developer roasting a portfolio project for a developer community site called DevFolio. Be sharp, funny and specific — never generic. Keep it under 80 words and never be cruel about the person, only the work.",
		title:  "AI Roast",
	},
	"feedback": {
		system: "You are a supportive senior developer giving balanced, constructive feedback on a portfolio project for DevFolio. Note one strength and one concrete improvement. Keep it under 80 words.",
		title:  "AI Feedback",
	},
	"suggestions": {
		system: "You are a pragmatic senior developer giving concrete, actionable suggestions to improve a portfolio project for DevFolio. Give 2-3 specific action items. Keep it under 80 words.",
		title:  "AI Suggestions",
	},
}

type aiGenerateRequest struct {
	PortfolioID uint   `json:"portfolioId" binding:"required"`
	Mode        string `json:"mode" binding:"required"`
	Prompt      string `json:"prompt"`
}

type aiGenerateResponse struct {
	Text string `json:"text"`
}

// GenerateAI runs a portfolio through AI Studio (roast / feedback / suggestions).
//
//	@Summary		Generate AI Studio feedback
//	@Tags			ai
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			body	body		aiGenerateRequest	true	"Target portfolio, mode, optional focus prompt"
//	@Success		200		{object}	aiGenerateResponse
//	@Failure		503		{object}	map[string]string
//	@Router			/ai/generate [post]
func (h *Handler) GenerateAI(c *gin.Context) {
	var req aiGenerateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	mode, ok := aiModePrompts[strings.ToLower(req.Mode)]
	if !ok {
		fail(c, http.StatusBadRequest, "mode must be roast, feedback or suggestions")
		return
	}

	var p db.Portfolio
	if err := h.DB.Preload("Versions").First(&p, req.PortfolioID).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}
	var latestNote string
	if len(p.Versions) > 0 {
		latestNote = p.Versions[len(p.Versions)-1].Note
	}

	userPrompt := fmt.Sprintf("Project: %s\nTags: %s\nLatest version notes: %s\n", p.Title, p.Tags, latestNote)
	if strings.TrimSpace(req.Prompt) != "" {
		userPrompt += "Focus specifically on: " + req.Prompt
	}

	text, err := h.AI.Generate(c.Request.Context(), mode.system, userPrompt)
	if err != nil {
		if errors.Is(err, ai.ErrNotConfigured) {
			fail(c, http.StatusServiceUnavailable, err.Error())
			return
		}
		failErr(c, http.StatusBadGateway, err)
		return
	}
	c.JSON(http.StatusOK, aiGenerateResponse{Text: text})
}

type aiShareRequest struct {
	PortfolioID uint   `json:"portfolioId" binding:"required"`
	Mode        string `json:"mode" binding:"required"`
	Text        string `json:"text" binding:"required"`
}

// ShareAI posts a saved AI Studio result to Community Roasts.
//
//	@Summary		Share an AI Studio result as a roast
//	@Tags			ai
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			body	body		aiShareRequest	true	"AI result to share"
//	@Success		201		{object}	RoastDTO
//	@Router			/ai/share [post]
func (h *Handler) ShareAI(c *gin.Context) {
	var req aiShareRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	mode, ok := aiModePrompts[strings.ToLower(req.Mode)]
	if !ok {
		fail(c, http.StatusBadRequest, "mode must be roast, feedback or suggestions")
		return
	}
	var p db.Portfolio
	if err := h.DB.First(&p, req.PortfolioID).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}

	userID := currentUserID(c)
	roast := db.Roast{PortfolioID: p.ID, UserID: userID, Title: mode.title, Body: req.Text, Stars: 0, AIGenerated: true}
	if err := h.DB.Create(&roast).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	h.DB.Preload("User").Preload("Portfolio").First(&roast, roast.ID)

	if p.UserID != userID {
		h.notify(p.UserID, userID, "roast", "shared AI "+strings.ToLower(mode.title[3:])+" on “"+p.Title+"”.", &p.ID)
	}
	c.JSON(http.StatusCreated, toRoastDTO(roast, latestScreenshot(h.DB, p.ID)))
}
