package handlers

import (
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ListPortfolios powers the Feed and Explore pages: every portfolio with its
// latest version, filterable by tag/search and sortable, with limit/offset
// paging for "Load more".
//
//	@Summary		List portfolios (feed / explore)
//	@Tags			portfolios
//	@Produce		json
//	@Param			sort	query		string	false	"trending | latest | mostliked | mostversions"
//	@Param			tag		query		string	false	"Filter by tag"
//	@Param			search	query		string	false	"Match title or author name"
//	@Param			mine	query		bool	false	"Only the authenticated user's portfolios"
//	@Param			limit	query		int		false	"Max results (default 30)"
//	@Param			offset	query		int		false	"Offset for paging"
//	@Success		200		{array}		PortfolioSummary
//	@Router			/portfolios [get]
func (h *Handler) ListPortfolios(c *gin.Context) {
	viewerID := currentUserID(c)

	query := h.DB.Preload("User").Preload("Versions", func(tx *gorm.DB) *gorm.DB {
		return tx.Order("number DESC").Limit(1)
	})

	if strings.EqualFold(c.Query("mine"), "true") {
		if viewerID == 0 {
			fail(c, http.StatusUnauthorized, "login required to view your own portfolios")
			return
		}
		query = query.Where("user_id = ?", viewerID)
	}
	if tag := strings.TrimSpace(c.Query("tag")); tag != "" && !strings.EqualFold(tag, "all") {
		query = query.Where("tags LIKE ?", "%"+tag+"%")
	}
	if search := strings.TrimSpace(c.Query("search")); search != "" {
		like := "%" + strings.ToLower(search) + "%"
		query = query.Joins("JOIN users ON users.id = portfolios.user_id").
			Where("LOWER(portfolios.title) LIKE ? OR LOWER(users.name) LIKE ?", like, like)
	}

	limit := queryInt(c, "limit", 30)
	offset := queryInt(c, "offset", 0)

	sortKey := strings.ToLower(c.DefaultQuery("sort", "trending"))
	var order string
	switch sortKey {
	case "latest", "newest":
		order = "portfolios.updated_at DESC, portfolios.id DESC"
	case "mostliked":
		order = "(SELECT COUNT(*) FROM likes l WHERE l.portfolio_id = portfolios.id) DESC, portfolios.id DESC"
	case "mostversions":
		order = "(SELECT COUNT(*) FROM versions v WHERE v.portfolio_id = portfolios.id) DESC, portfolios.id DESC"
	}

	var portfolios []db.Portfolio

	if sortKey == "trending" {
		query.Order("(SELECT COUNT(*) FROM likes l WHERE l.portfolio_id = portfolios.id) DESC, portfolios.id DESC").
			Limit(trendingCandidateLimit).Find(&portfolios)
	} else {
		query.Order(order + ", portfolios.id DESC").Limit(limit).Offset(offset).Find(&portfolios)
	}

	items := hydratePortfolios(h.DB, portfolios, viewerID)

	if sortKey == "trending" { // recency-weighted likes, computed after a bounded fetch
		sort.Slice(items, func(i, j int) bool { return trendingScore(items[i]) > trendingScore(items[j]) })
		items = page(items, offset, limit)
	}

	c.JSON(http.StatusOK, items)
}

// trendingCandidateLimit bounds the set fetched before recency-weighting likes,
// so trending stays accurate without loading the whole table on hot feeds.
const trendingCandidateLimit = 300

func trendingScore(p PortfolioSummary) float64 {
	ageHours := time.Since(p.LatestVersion.CreatedAt).Hours()
	return float64(p.LikeCount+1) / (ageHours + 6)
}

func queryInt(c *gin.Context, key string, fallback int) int {
	v, err := strconv.Atoi(c.Query(key))
	if err != nil || v <= 0 {
		return fallback
	}
	return v
}

func page(items []PortfolioSummary, offset, limit int) []PortfolioSummary {
	if offset >= len(items) {
		return []PortfolioSummary{}
	}
	end := offset + limit
	if end > len(items) {
		end = len(items)
	}
	return items[offset:end]
}

// GetPortfolio returns full detail for one portfolio, including every version.
//
//	@Summary		Get a portfolio's detail
//	@Tags			portfolios
//	@Produce		json
//	@Param			id	path		int	true	"Portfolio ID"
//	@Success		200	{object}	PortfolioDetail
//	@Failure		404	{object}	map[string]string
//	@Router			/portfolios/{id} [get]
func (h *Handler) GetPortfolio(c *gin.Context) {
	var p db.Portfolio
	if err := h.DB.Preload("User").Preload("Versions", func(tx *gorm.DB) *gorm.DB {
		return tx.Order("versions.number ASC")
	}).First(&p, c.Param("id")).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}
	summaries := hydratePortfolios(h.DB, []db.Portfolio{p}, currentUserID(c))
	if len(summaries) == 0 {
		fail(c, http.StatusNotFound, "portfolio has no versions")
		return
	}
	versions := make([]VersionDTO, 0, len(p.Versions))
	for _, v := range p.Versions {
		versions = append(versions, toVersionDTO(v))
	}
	c.JSON(http.StatusOK, PortfolioDetail{PortfolioSummary: summaries[0], Versions: versions})
}

type createPortfolioRequest struct {
	Title         string   `json:"title" binding:"required"`
	Note          string   `json:"note"`
	ScreenshotURL string   `json:"screenshotUrl"`
	ProjectURL    string   `json:"projectUrl"`
	Tags          []string `json:"tags"`
}

// CreatePortfolio posts a brand-new portfolio (its first version).
//
//	@Summary		Post a new portfolio
//	@Tags			portfolios
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			body	body		createPortfolioRequest	true	"Portfolio + first version"
//	@Success		201		{object}	PortfolioDetail
//	@Router			/portfolios [post]
func (h *Handler) CreatePortfolio(c *gin.Context) {
	var req createPortfolioRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	if strings.TrimSpace(req.ScreenshotURL) == "" {
		req.ScreenshotURL = coverScreenshot(req.ProjectURL)
	}

	p := db.Portfolio{UserID: currentUserID(c), Title: req.Title, Tags: strings.Join(req.Tags, ",")}
	if err := h.DB.Create(&p).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	v := db.Version{PortfolioID: p.ID, Number: 1, Note: req.Note, ScreenshotURL: req.ScreenshotURL, ProjectURL: req.ProjectURL, UIRating: 0, UXRating: 0, CodeRating: 0}
	if err := h.DB.Create(&v).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}

	h.DB.Preload("User").First(&p, p.ID)
	p.Versions = []db.Version{v} // hydratePortfolios needs at least one version to build a summary
	summaries := hydratePortfolios(h.DB, []db.Portfolio{p}, currentUserID(c))
	c.JSON(http.StatusCreated, PortfolioDetail{PortfolioSummary: summaries[0], Versions: []VersionDTO{toVersionDTO(v)}})
}

type addVersionRequest struct {
	Note          string `json:"note"`
	ScreenshotURL string `json:"screenshotUrl"`
	ProjectURL    string `json:"projectUrl"`
}

// AddVersion ships a new version onto an existing portfolio you own.
//
//	@Summary		Add a new version to a portfolio
//	@Tags			portfolios
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id		path		int					true	"Portfolio ID"
//	@Param			body	body		addVersionRequest	true	"New version"
//	@Success		201		{object}	VersionDTO
//	@Failure		403		{object}	map[string]string
//	@Router			/portfolios/{id}/versions [post]
func (h *Handler) AddVersion(c *gin.Context) {
	var p db.Portfolio
	if err := h.DB.First(&p, c.Param("id")).Error; err != nil {
		fail(c, http.StatusNotFound, "portfolio not found")
		return
	}
	if p.UserID != currentUserID(c) {
		fail(c, http.StatusForbidden, "only the owner can add a new version")
		return
	}
	var req addVersionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		failErr(c, http.StatusBadRequest, err)
		return
	}
	if strings.TrimSpace(req.ScreenshotURL) == "" {
		req.ScreenshotURL = coverScreenshot(req.ProjectURL)
		if req.ScreenshotURL == "" {
			var last db.Version
			h.DB.Where("portfolio_id = ?", p.ID).Order("number DESC").First(&last)
			req.ScreenshotURL = last.ScreenshotURL
		}
	}

	var maxNumber int
	h.DB.Model(&db.Version{}).Where("portfolio_id = ?", p.ID).Select("COALESCE(MAX(number), 0)").Scan(&maxNumber)

	v := db.Version{PortfolioID: p.ID, Number: maxNumber + 1, Note: req.Note, ScreenshotURL: req.ScreenshotURL, ProjectURL: req.ProjectURL}
	if err := h.DB.Create(&v).Error; err != nil {
		failErr(c, http.StatusInternalServerError, err)
		return
	}
	h.DB.Model(&p).Update("updated_at", time.Now())
	c.JSON(http.StatusCreated, toVersionDTO(v))
}

var placeholderShots = []string{
	"/screenshots/shot-01.png", "/screenshots/shot-02.png", "/screenshots/shot-03.png",
	"/screenshots/shot-04.png", "/screenshots/shot-05.png", "/screenshots/shot-06.png",
	"/screenshots/shot-07.png", "/screenshots/shot-08.png", "/screenshots/shot-09.png",
}

func placeholderScreenshot() string {
	return placeholderShots[time.Now().UnixNano()%int64(len(placeholderShots))]
}

// coverScreenshot returns a real screenshot thumbnail of the project URL when
// one is provided (via the free WordPress mshots service), otherwise an empty
// string so callers can fall back to a placeholder.
func coverScreenshot(projectURL string) string {
	url := strings.TrimSpace(projectURL)
	if url == "" || !(strings.HasPrefix(url, "http://") || strings.HasPrefix(url, "https://")) {
		return ""
	}
	return "https://s.wordpress.com/mshots/v1/" + url + "?w=640"
}
