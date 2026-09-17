package handlers

import (
	"strconv"
	"strings"
	"time"

	"foliohub/internals/db"

	"gorm.io/gorm"
)

// UserPublic is the safe, public-facing shape of a User.
type UserPublic struct {
	ID          uint   `json:"id"`
	Username    string `json:"username"`
	Name        string `json:"name"`
	Role        string `json:"role"`
	Initials    string `json:"initials"`
	Bio         string `json:"bio,omitempty"`
	Location    string `json:"location,omitempty"`
	GithubURL   string `json:"githubUrl,omitempty"`
	LinkedinURL string `json:"linkedinUrl,omitempty"`
	TwitterURL  string `json:"twitterUrl,omitempty"`
	WebsiteURL  string `json:"websiteUrl,omitempty"`
}

func toUserPublic(u db.User) UserPublic {
	return UserPublic{
		ID: u.ID, Username: u.Username, Name: u.Name, Role: u.Role, Initials: u.Initials(),
		Bio: u.Bio, Location: u.Location,
		GithubURL: u.GithubURL, LinkedinURL: u.LinkedinURL, TwitterURL: u.TwitterURL, WebsiteURL: u.WebsiteURL,
	}
}

// VersionDTO is a Version as sent over the wire.
type VersionDTO struct {
	ID            uint      `json:"id"`
	Number        int       `json:"number"`
	Label         string    `json:"label"`
	Note          string    `json:"note"`
	ScreenshotURL string    `json:"screenshotUrl"`
	ProjectURL    string    `json:"projectUrl,omitempty"`
	UIRating      float64   `json:"uiRating"`
	UXRating      float64   `json:"uxRating"`
	CodeRating    float64   `json:"codeRating"`
	CreatedAt     time.Time `json:"createdAt"`
}

func toVersionDTO(v db.Version) VersionDTO {
	return VersionDTO{
		ID: v.ID, Number: v.Number, Label: versionLabel(v.Number), Note: v.Note,
		ScreenshotURL: v.ScreenshotURL, ProjectURL: v.ProjectURL,
		UIRating: v.UIRating, UXRating: v.UXRating, CodeRating: v.CodeRating,
		CreatedAt: v.CreatedAt,
	}
}

func versionLabel(n int) string {
	return "v" + strconv.Itoa(n)
}

// PortfolioSummary is the card-level shape used by feed/explore/profile lists.
type PortfolioSummary struct {
	ID            uint       `json:"id"`
	Title         string     `json:"title"`
	Tags          []string   `json:"tags"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	User          UserPublic `json:"user"`
	LatestVersion VersionDTO `json:"latestVersion"`
	VersionCount  int        `json:"versionCount"`
	LikeCount     int64      `json:"likeCount"`
	CommentCount  int64      `json:"commentCount"`
	LikedByMe     bool       `json:"likedByMe"`
	Demo          bool       `json:"demo"` // seeded sample data, not a real project
}

// PortfolioDetail extends PortfolioSummary with the full version history.
type PortfolioDetail struct {
	PortfolioSummary
	Versions []VersionDTO `json:"versions"`
}

func splitTags(tags string) []string {
	if strings.TrimSpace(tags) == "" {
		return []string{}
	}
	parts := strings.Split(tags, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

// hydratePortfolios turns raw Portfolio rows (with Versions preloaded) into
// PortfolioSummary DTOs, batching like/comment counts and the viewer's own
// like state in a handful of queries regardless of list size.
func hydratePortfolios(gdb *gorm.DB, portfolios []db.Portfolio, viewerID uint) []PortfolioSummary {
	ids := make([]uint, 0, len(portfolios))
	for _, p := range portfolios {
		ids = append(ids, p.ID)
	}

	likeCounts := map[uint]int64{}
	commentCounts := map[uint]int64{}
	versionCounts := map[uint]int{}
	likedByViewer := map[uint]bool{}

	if len(ids) > 0 {
		type countRow struct {
			PortfolioID uint
			Count       int64
		}
		var likeRows []countRow
		gdb.Table("likes").Select("portfolio_id, count(*) as count").Where("portfolio_id IN ?", ids).Group("portfolio_id").Scan(&likeRows)
		for _, r := range likeRows {
			likeCounts[r.PortfolioID] = r.Count
		}

		var commentRows []countRow
		gdb.Table("comments").Select("portfolio_id, count(*) as count").Where("portfolio_id IN ?", ids).Group("portfolio_id").Scan(&commentRows)
		for _, r := range commentRows {
			commentCounts[r.PortfolioID] = r.Count
		}

		var versionRows []countRow
		gdb.Table("versions").Select("portfolio_id, count(*) as count").Where("portfolio_id IN ?", ids).Group("portfolio_id").Scan(&versionRows)
		for _, r := range versionRows {
			versionCounts[r.PortfolioID] = int(r.Count)
		}

		if viewerID != 0 {
			var liked []uint
			gdb.Table("likes").Select("portfolio_id").Where("portfolio_id IN ? AND user_id = ?", ids, viewerID).Scan(&liked)
			for _, id := range liked {
				likedByViewer[id] = true
			}
		}
	}

	out := make([]PortfolioSummary, 0, len(portfolios))
	for _, p := range portfolios {
		if len(p.Versions) == 0 {
			continue
		}
		latest := p.Versions[0]
		for _, v := range p.Versions[1:] {
			if v.Number > latest.Number {
				latest = v
			}
		}
		out = append(out, PortfolioSummary{
			ID: p.ID, Title: p.Title, Tags: splitTags(p.Tags), CreatedAt: p.CreatedAt, UpdatedAt: p.UpdatedAt,
			User:          toUserPublic(p.User),
			LatestVersion: toVersionDTO(latest),
			VersionCount:  versionCounts[p.ID],
			LikeCount:     likeCounts[p.ID],
			CommentCount:  commentCounts[p.ID],
			LikedByMe:     likedByViewer[p.ID],
			Demo:          p.Demo,
		})
	}
	return out
}
