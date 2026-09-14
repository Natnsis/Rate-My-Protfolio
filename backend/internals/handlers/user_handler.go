package handlers

import (
	"net/http"
	"strings"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type userStats struct {
	PortfolioCount int64 `json:"portfolioCount"`
	TotalLikes     int64 `json:"totalLikes"`
	Rank           int   `json:"rank"`
}

type userProfileResponse struct {
	User  UserPublic `json:"user"`
	Stats userStats  `json:"stats"`
}

// GetUserByUsername returns a public profile with aggregate stats.
//
//	@Summary		Get a user's public profile
//	@Tags			users
//	@Produce		json
//	@Param			username	path		string	true	"Username"
//	@Success		200			{object}	userProfileResponse
//	@Failure		404			{object}	map[string]string
//	@Router			/users/{username} [get]
func (h *Handler) GetUserByUsername(c *gin.Context) {
	username := strings.ToLower(c.Param("username"))
	var user db.User
	if err := h.DB.Where("username = ?", username).First(&user).Error; err != nil {
		fail(c, http.StatusNotFound, "user not found")
		return
	}
	c.JSON(http.StatusOK, userProfileResponse{User: toUserPublic(user), Stats: h.statsFor(user.ID)})
}

// Me returns the authenticated user's own profile with stats.
//
//	@Summary		Current user's profile with stats
//	@Tags			users
//	@Produce		json
//	@Security		BearerAuth
//	@Success		200	{object}	userProfileResponse
//	@Router			/users/me [get]
func (h *Handler) MeProfile(c *gin.Context) {
	var user db.User
	if err := h.DB.First(&user, currentUserID(c)).Error; err != nil {
		fail(c, http.StatusNotFound, "user not found")
		return
	}
	c.JSON(http.StatusOK, userProfileResponse{User: toUserPublic(user), Stats: h.statsFor(user.ID)})
}

func (h *Handler) statsFor(userID uint) userStats {
	var stats userStats
	h.DB.Model(&db.Portfolio{}).Where("user_id = ?", userID).Count(&stats.PortfolioCount)

	h.DB.Raw(`
		SELECT COUNT(*) FROM likes l
		JOIN portfolios p ON p.id = l.portfolio_id
		WHERE p.user_id = ?`, userID).Scan(&stats.TotalLikes)

	type rankRow struct {
		UserID uint
		Likes  int64
	}
	var rows []rankRow
	h.DB.Raw(`
		SELECT p.user_id as user_id, COUNT(l.id) as likes
		FROM portfolios p
		LEFT JOIN likes l ON l.portfolio_id = p.id
		GROUP BY p.user_id
		ORDER BY likes DESC`).Scan(&rows)
	stats.Rank = 0
	for i, r := range rows {
		if r.UserID == userID {
			stats.Rank = i + 1
			break
		}
	}
	return stats
}

type updateMeRequest struct {
	Name        *string `json:"name"`
	Bio         *string `json:"bio"`
	Location    *string `json:"location"`
	Role        *string `json:"role"`
	GithubURL   *string `json:"githubUrl"`
	LinkedinURL *string `json:"linkedinUrl"`
	TwitterURL  *string `json:"twitterUrl"`
	WebsiteURL  *string `json:"websiteUrl"`
}

// UpdateMe patches the authenticated user's editable profile fields.
//
//	@Summary		Update my profile
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			body	body		updateMeRequest	true	"Fields to update"
//	@Success		200		{object}	UserPublic
//	@Router			/users/me [patch]
func (h *Handler) UpdateMe(c *gin.Context) {
	var req updateMeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	var user db.User
	if err := h.DB.First(&user, currentUserID(c)).Error; err != nil {
		fail(c, http.StatusNotFound, "user not found")
		return
	}
	updates := map[string]interface{}{}
	assign := func(key string, v *string) {
		if v != nil {
			updates[key] = *v
		}
	}
	assign("name", req.Name)
	assign("bio", req.Bio)
	assign("location", req.Location)
	assign("role", req.Role)
	assign("github_url", req.GithubURL)
	assign("linkedin_url", req.LinkedinURL)
	assign("twitter_url", req.TwitterURL)
	assign("website_url", req.WebsiteURL)
	if len(updates) > 0 {
		h.DB.Model(&user).Updates(updates)
	}
	c.JSON(http.StatusOK, toUserPublic(user))
}

// ListUserPortfolios lists every portfolio a given user has posted.
//
//	@Summary		List a user's portfolios
//	@Tags			users
//	@Produce		json
//	@Param			username	path		string	true	"Username"
//	@Success		200			{array}		PortfolioSummary
//	@Failure		404			{object}	map[string]string
//	@Router			/users/{username}/portfolios [get]
func (h *Handler) ListUserPortfolios(c *gin.Context) {
	username := strings.ToLower(c.Param("username"))
	var user db.User
	if err := h.DB.Where("username = ?", username).First(&user).Error; err != nil {
		fail(c, http.StatusNotFound, "user not found")
		return
	}
	var portfolios []db.Portfolio
	h.DB.Preload("User").Preload("Versions", func(tx *gorm.DB) *gorm.DB {
		return tx.Order("versions.number ASC")
	}).Where("user_id = ?", user.ID).Order("updated_at DESC").Find(&portfolios)
	c.JSON(http.StatusOK, hydratePortfolios(h.DB, portfolios, currentUserID(c)))
}
