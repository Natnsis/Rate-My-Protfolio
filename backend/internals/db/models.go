package db

import (
	"strings"
	"time"
	"unicode"
)

// User is a registered DevFolio member.
type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Username     string    `json:"username" gorm:"uniqueIndex;size:32;not null"`
	Email        string    `json:"email" gorm:"uniqueIndex;size:255;not null"`
	PasswordHash string    `json:"-" gorm:"not null"`
	Name         string    `json:"name"`
	Role         string    `json:"role"`
	Bio          string    `json:"bio"`
	Location     string    `json:"location"`
	GithubURL    string    `json:"githubUrl"`
	LinkedinURL  string    `json:"linkedinUrl"`
	TwitterURL   string    `json:"twitterUrl"`
	WebsiteURL   string    `json:"websiteUrl"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// Initials returns a 1-2 letter avatar fallback derived from Name.
func (u User) Initials() string {
	return initialsOf(u.Name)
}

func initialsOf(name string) string {
	fields := strings.Fields(name)
	var out []rune
	for _, f := range fields {
		for _, r := range f {
			out = append(out, unicode.ToUpper(r))
			break
		}
		if len(out) >= 2 {
			break
		}
	}
	if len(out) == 0 {
		return "?"
	}
	return string(out)
}

// Portfolio is a project a user has posted; it groups one or more Versions.
type Portfolio struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId" gorm:"index;not null"`
	User      User      `json:"user"`
	Title     string    `json:"title" gorm:"not null"`
	Tags      string    `json:"-"`                               // comma-separated; exposed as []string in DTOs
	Demo      bool      `json:"demo" gorm:"default:false;index"` // seeded sample data, not a real project
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	Versions []Version `json:"versions,omitempty"`
}

// Version is one shipped iteration of a Portfolio.
type Version struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	PortfolioID   uint      `json:"portfolioId" gorm:"index;not null"`
	Number        int       `json:"number" gorm:"not null"`
	Note          string    `json:"note"`
	ScreenshotURL string    `json:"screenshotUrl"`
	ProjectURL    string    `json:"projectUrl"`
	UIRating      float64   `json:"uiRating"`
	UXRating      float64   `json:"uxRating"`
	CodeRating    float64   `json:"codeRating"`
	CreatedAt     time.Time `json:"createdAt"`
}

// Like records a single user's like on a Portfolio (one per user).
type Like struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"userId" gorm:"uniqueIndex:idx_like_user_portfolio;not null"`
	PortfolioID uint      `json:"portfolioId" gorm:"uniqueIndex:idx_like_user_portfolio;not null"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Comment is short feedback left on a Portfolio's current version.
type Comment struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	PortfolioID uint      `json:"portfolioId" gorm:"index;not null"`
	UserID      uint      `json:"userId" gorm:"not null"`
	User        User      `json:"user"`
	Text        string    `json:"text" gorm:"not null"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Roast is a structured, longer-form review shown on the Community Roasts feed.
type Roast struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	PortfolioID uint      `json:"portfolioId" gorm:"index;not null"`
	Portfolio   Portfolio `json:"portfolio"`
	UserID      uint      `json:"userId" gorm:"not null"`
	User        User      `json:"user"`
	Title       string    `json:"title" gorm:"not null"`
	Body        string    `json:"body" gorm:"not null"`
	Stars       int       `json:"stars"`
	Helpful     int       `json:"helpful"`
	AIGenerated bool      `json:"aiGenerated"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Notification is an event fired at a user (like, comment, roast, rank change...).
type Notification struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"userId" gorm:"index;not null"` // recipient
	ActorID     *uint     `json:"actorId"`
	Actor       *User     `json:"actor"`
	Kind        string    `json:"kind"` // like | comment | roast | rank | system
	Message     string    `json:"message"`
	PortfolioID *uint     `json:"portfolioId"`
	Read        bool      `json:"read" gorm:"default:false"`
	CreatedAt   time.Time `json:"createdAt"`
}
