package handlers

import (
	"net/http"
	"sort"
	"strings"
	"time"

	"foliohub/internals/db"

	"github.com/gin-gonic/gin"
)

// LeaderboardRow is one ranked developer.
type LeaderboardRow struct {
	Rank           int        `json:"rank"`
	User           UserPublic `json:"user"`
	TotalLikes     int64      `json:"totalLikes"`
	VersionCount   int64      `json:"versionCount"`
	RecentScreens  []string   `json:"recentScreenshots"`
	MorePortfolios int        `json:"morePortfolios"`
	TopPortfolioID uint       `json:"topPortfolioId"`
}

// GetLeaderboard ranks developers by total likes within a timeframe.
//
//	@Summary		Leaderboard
//	@Tags			leaderboard
//	@Produce		json
//	@Param			timeframe	query		string	false	"weekly | monthly | alltime (default weekly)"
//	@Param			category	query		string	false	"Filter by tag"
//	@Param			limit		query		int		false	"Max results (default 20)"
//	@Success		200			{array}		LeaderboardRow
//	@Router			/leaderboard [get]
func (h *Handler) GetLeaderboard(c *gin.Context) {
	since := timeframeSince(c.DefaultQuery("timeframe", "weekly"))
	category := strings.TrimSpace(c.Query("category"))

	var portfolios []db.Portfolio
	q := h.DB.Preload("User")
	if category != "" && !strings.EqualFold(category, "all") {
		q = q.Where("tags LIKE ?", "%"+category+"%")
	}
	q.Find(&portfolios)

	type portfolioAgg struct {
		id         uint
		likes      int64
		screenshot string
	}
	type agg struct {
		user       db.User
		likes      int64
		versions   int64
		portfolios []portfolioAgg
	}
	byUser := map[uint]*agg{}

	for _, p := range portfolios {
		var versionCount int64
		h.DB.Model(&db.Version{}).Where("portfolio_id = ?", p.ID).Count(&versionCount)

		var likeCount int64
		likeQuery := h.DB.Model(&db.Like{}).Where("portfolio_id = ?", p.ID)
		if !since.IsZero() {
			likeQuery = likeQuery.Where("created_at >= ?", since)
		}
		likeQuery.Count(&likeCount)

		a, ok := byUser[p.UserID]
		if !ok {
			a = &agg{user: p.User}
			byUser[p.UserID] = a
		}
		a.likes += likeCount
		a.versions += versionCount
		a.portfolios = append(a.portfolios, portfolioAgg{id: p.ID, likes: likeCount, screenshot: latestScreenshot(h.DB, p.ID)})
	}

	rows := make([]LeaderboardRow, 0, len(byUser))
	for _, a := range byUser {
		// Most-liked portfolio first, so the spotlight screenshots and
		// "top portfolio" link point at the work actually carrying the rank.
		sort.Slice(a.portfolios, func(i, j int) bool { return a.portfolios[i].likes > a.portfolios[j].likes })

		screens := make([]string, 0, 2)
		var topID uint
		for i, p := range a.portfolios {
			if i == 0 {
				topID = p.id
			}
			if i < 2 {
				screens = append(screens, p.screenshot)
			}
		}
		more := len(a.portfolios) - len(screens)
		if more < 0 {
			more = 0
		}

		rows = append(rows, LeaderboardRow{
			User: toUserPublic(a.user), TotalLikes: a.likes, VersionCount: a.versions,
			RecentScreens: screens, MorePortfolios: more, TopPortfolioID: topID,
		})
	}
	sortRowsByLikes(rows)

	limit := queryInt(c, "limit", 20)
	if limit > len(rows) {
		limit = len(rows)
	}
	rows = rows[:limit]
	for i := range rows {
		rows[i].Rank = i + 1
	}
	c.JSON(http.StatusOK, rows)
}

func sortRowsByLikes(rows []LeaderboardRow) {
	for i := 1; i < len(rows); i++ {
		j := i
		for j > 0 && rows[j-1].TotalLikes < rows[j].TotalLikes {
			rows[j-1], rows[j] = rows[j], rows[j-1]
			j--
		}
	}
}

func timeframeSince(tf string) time.Time {
	switch strings.ToLower(tf) {
	case "monthly":
		return time.Now().AddDate(0, 0, -30)
	case "alltime":
		return time.Time{}
	default: // weekly
		return time.Now().AddDate(0, 0, -7)
	}
}

// TopStackResponse summarizes the most common technology tag on the platform.
type TopStackResponse struct {
	Stack          string `json:"stack"`
	DeveloperCount int64  `json:"developerCount"`
}

// GetTopStack returns the most popular tag and how many developers use it.
//
//	@Summary		Most popular stack/tag
//	@Tags			leaderboard
//	@Produce		json
//	@Success		200	{object}	TopStackResponse
//	@Router			/leaderboard/top-stack [get]
func (h *Handler) GetTopStack(c *gin.Context) {
	var portfolios []db.Portfolio
	h.DB.Find(&portfolios)

	tagUsers := map[string]map[uint]bool{}
	for _, p := range portfolios {
		for _, tag := range splitTags(p.Tags) {
			if tagUsers[tag] == nil {
				tagUsers[tag] = map[uint]bool{}
			}
			tagUsers[tag][p.UserID] = true
		}
	}
	best, bestCount := "—", 0
	for tag, users := range tagUsers {
		if len(users) > bestCount {
			best, bestCount = tag, len(users)
		}
	}
	c.JSON(http.StatusOK, TopStackResponse{Stack: best, DeveloperCount: int64(bestCount)})
}
