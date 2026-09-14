package db

import (
	"time"

	"foliohub/internals/auth"

	"gorm.io/gorm"
)

// Seed populates a fresh database with demo users, portfolios, versions,
// likes, comments and roasts so the app feels alive on first run.
// Every seeded account uses the password "password123".
func Seed(gdb *gorm.DB) error {
	pass, err := auth.HashPassword("password123")
	if err != nil {
		return err
	}

	users := []User{
		{Username: "ariac", Email: "aria@devfolio.dev", PasswordHash: pass, Name: "Aria Chen", Role: "Frontend Developer", Bio: "Frontend engineer who loves building clean, fast and meaningful interfaces.", Location: "Lisbon, Portugal"},
		{Username: "malikux", Email: "malik@devfolio.dev", PasswordHash: pass, Name: "Malik Okoye", Role: "Mobile App Developer", Bio: "Crafting simple, meaningful experiences for web and mobile.", Location: "Lagos, Nigeria"},
		{Username: "priyacodes", Email: "priya@devfolio.dev", PasswordHash: pass, Name: "Priya Nair", Role: "Systems Engineer", Bio: "Low-level tinkerer, CLI enthusiast.", Location: "Bengaluru, India"},
		{Username: "owenb", Email: "owen@devfolio.dev", PasswordHash: pass, Name: "Owen Blake", Role: "Full Stack Developer", Bio: "Local-first software advocate.", Location: "Austin, USA"},
		{Username: "sofiar", Email: "sofia@devfolio.dev", PasswordHash: pass, Name: "Sofia Reyes", Role: "Design Engineer", Bio: "Bridging design and code, one component at a time.", Location: "Mexico City, Mexico"},
		{Username: "diegof", Email: "diego@devfolio.dev", PasswordHash: pass, Name: "Diego Fuentes", Role: "UI/UX Developer", Bio: "Obsessed with data-dense interfaces that stay simple.", Location: "Madrid, Spain"},
		{Username: "hanak", Email: "hana@devfolio.dev", PasswordHash: pass, Name: "Hana Kobayashi", Role: "Product Designer", Bio: "Designing calm, useful software.", Location: "Tokyo, Japan"},
		{Username: "leom", Email: "leo@devfolio.dev", PasswordHash: pass, Name: "Leo Martins", Role: "Web Developer", Bio: "Building on the open web.", Location: "Porto, Portugal"},
	}
	if err := gdb.Create(&users).Error; err != nil {
		return err
	}
	byName := map[string]User{}
	for _, u := range users {
		byName[u.Username] = u
	}

	type seedVersion struct {
		note         string
		screenshot   string
		ui, ux, code float64
		hoursAgo     int
	}
	type seedPortfolio struct {
		owner    string
		title    string
		tags     string
		versions []seedVersion
	}

	portfolios := []seedPortfolio{
		{
			owner: "ariac", title: "Lumen Dashboard", tags: "Web,Analytics,React",
			versions: []seedVersion{
				{"Initial dashboard layout with static charts.", "/screenshots/shot-01.png", 7.8, 7.5, 7.0, 96},
				{"Added filter panel and saved views.", "/screenshots/shot-01.png", 8.3, 8.0, 7.4, 48},
				{"New chart engine, command palette, and dark mode polish.", "/screenshots/shot-01.png", 8.9, 8.4, 7.6, 4},
			},
		},
		{
			owner: "malikux", title: "Fernweg Travel App", tags: "Mobile,Motion,Figma to code",
			versions: []seedVersion{
				{"First cut of the travel app with basic search.", "/screenshots/shot-09.png", 7.6, 7.2, 7.0, 300},
				{"Added map view and saved trips.", "/screenshots/shot-09.png", 8.1, 7.9, 7.4, 220},
				{"Introduced booking flow.", "/screenshots/shot-09.png", 8.6, 8.3, 7.8, 140},
				{"Polished onboarding and empty states.", "/screenshots/shot-09.png", 9.0, 8.7, 8.0, 60},
				{"v5 adds a trip-planning timeline and offline itinerary caching.", "/screenshots/shot-03.png", 9.2, 9.0, 8.1, 2},
			},
		},
		{
			owner: "priyacodes", title: "Ledger CLI", tags: "CLI,Rust,DX",
			versions: []seedVersion{
				{"Initial CLI with basic ledger commands.", "/screenshots/shot-08.png", 6.8, 7.4, 9.0, 180},
				{"Plugin support and colorized diffs.", "/screenshots/shot-02.png", 7.1, 7.8, 9.4, 6},
			},
		},
		{
			owner: "owenb", title: "Nimbus Notes", tags: "Notes,Local-first,Svelte",
			versions: []seedVersion{
				{"First public version with local-first e2e sync.", "/screenshots/shot-06.png", 8.0, 8.2, 7.9, 9},
			},
		},
		{
			owner: "sofiar", title: "Atlas Design Kit", tags: "Design Systems,UI/UX",
			versions: []seedVersion{
				{"Foundational tokens and component primitives.", "/screenshots/shot-05.png", 8.2, 7.9, 7.7, 200},
				{"Expanded pattern library and dark theme.", "/screenshots/shot-05.png", 8.7, 8.4, 8.0, 11},
			},
		},
		{
			owner: "diegof", title: "Pulse Analytics", tags: "Web,Backend,AI Tools",
			versions: []seedVersion{
				{"Realtime pipeline and first dashboards.", "/screenshots/shot-06.png", 8.4, 8.1, 8.3, 60},
				{"Anomaly detection and alerting.", "/screenshots/shot-06.png", 9.0, 8.6, 8.7, 14},
			},
		},
		{
			owner: "hanak", title: "Kettle Recipes", tags: "Mobile,UI/UX",
			versions: []seedVersion{
				{"Recipe browser with offline favorites.", "/screenshots/shot-09.png", 7.5, 7.7, 7.3, 24},
				{"Meal planning and grocery lists.", "/screenshots/shot-09.png", 7.8, 7.9, 7.5, 1},
			},
		},
		{
			owner: "ariac", title: "Portfolio Site", tags: "Web,Tailwind,Personal",
			versions: []seedVersion{
				{"First cut: single page, project list.", "/screenshots/shot-03.png", 7.4, 7.1, 7.2, 260},
				{"New hero, case studies and hover states.", "/screenshots/shot-03.png", 8.2, 7.8, 7.9, 8},
			},
		},
		{
			owner: "leom", title: "Chess Trainer", tags: "Web,AI Tools",
			versions: []seedVersion{
				{"Basic board and puzzle rush mode.", "/screenshots/shot-08.png", 7.0, 7.2, 7.6, 40},
				{"Added engine hints and opening trainer.", "/screenshots/shot-02.png", 7.6, 7.7, 8.0, 3},
			},
		},
	}

	now := time.Now()
	portfolioByTitle := map[string]Portfolio{}

	for _, sp := range portfolios {
		owner := byName[sp.owner]
		p := Portfolio{UserID: owner.ID, Title: sp.title, Tags: sp.tags, CreatedAt: now.Add(-time.Duration(sp.versions[0].hoursAgo+24) * time.Hour)}
		if err := gdb.Create(&p).Error; err != nil {
			return err
		}
		for i, v := range sp.versions {
			ver := Version{
				PortfolioID:   p.ID,
				Number:        i + 1,
				Note:          v.note,
				ScreenshotURL: v.screenshot,
				UIRating:      v.ui,
				UXRating:      v.ux,
				CodeRating:    v.code,
				CreatedAt:     now.Add(-time.Duration(v.hoursAgo) * time.Hour),
			}
			if err := gdb.Create(&ver).Error; err != nil {
				return err
			}
		}
		p.UpdatedAt = now.Add(-time.Duration(sp.versions[len(sp.versions)-1].hoursAgo) * time.Hour)
		gdb.Save(&p)
		portfolioByTitle[sp.title] = p
	}

	// Sprinkle some likes across users so the leaderboard has real signal.
	likeMatrix := map[string][]string{
		"Fernweg Travel App": {"ariac", "priyacodes", "owenb", "sofiar", "diegof", "hanak", "leom"},
		"Lumen Dashboard":    {"malikux", "priyacodes", "owenb", "sofiar"},
		"Pulse Analytics":    {"ariac", "malikux", "priyacodes", "hanak", "leom"},
		"Atlas Design Kit":   {"ariac", "malikux", "diegof"},
		"Ledger CLI":         {"owenb", "sofiar"},
		"Portfolio Site":     {"malikux", "hanak"},
		"Kettle Recipes":     {"leom"},
		"Nimbus Notes":       {"ariac"},
		"Chess Trainer":      {"priyacodes"},
	}
	for title, likers := range likeMatrix {
		p := portfolioByTitle[title]
		for _, username := range likers {
			gdb.Create(&Like{UserID: byName[username].ID, PortfolioID: p.ID, CreatedAt: now})
		}
	}

	// A few comments for texture on the busiest posts.
	comments := []struct {
		portfolio, author, text string
		hoursAgo                int
	}{
		{"Lumen Dashboard", "malikux", "The command palette feels so fast. What's the shortcut?", 12},
		{"Lumen Dashboard", "priyacodes", "Chart engine switch is huge. Curious about bundle size impact.", 60},
		{"Fernweg Travel App", "ariac", "Offline caching on a travel app is such a smart call.", 40},
		{"Fernweg Travel App", "leom", "Timeline UI is gorgeous, would love a case study writeup.", 120},
		{"Ledger CLI", "owenb", "Colorized diffs alone make this worth switching to.", 360},
		{"Portfolio Site", "sofiar", "Great rhythm, tight spacing.", 480},
	}
	for _, c := range comments {
		p := portfolioByTitle[c.portfolio]
		gdb.Create(&Comment{PortfolioID: p.ID, UserID: byName[c.author].ID, Text: c.text, CreatedAt: now.Add(-time.Duration(c.hoursAgo) * time.Hour)})
	}

	// Seed the Community Roasts feed.
	roasts := []struct {
		portfolio, author, title, body string
		stars, helpful                 int
	}{
		{"Fernweg Travel App", "malikux", "The real problem is the hero", "Impressive tech, but the hero reads like a template. Show the product working in context instead of a flat screenshot.", 4, 28},
		{"Lumen Dashboard", "priyacodes", "Big performance win on the grid", "The data table holds up under load. I'd push the empty states a bit further so they don't feel like afterthoughts.", 5, 41},
		{"Ledger CLI", "sofiar", "Nice structure, loose details", "Strong IA, but spacing jumps around between sections. Pick a rhythm and stay on it.", 3, 15},
	}
	for _, r := range roasts {
		p := portfolioByTitle[r.portfolio]
		gdb.Create(&Roast{PortfolioID: p.ID, UserID: byName[r.author].ID, Title: r.title, Body: r.body, Stars: r.stars, Helpful: r.helpful, CreatedAt: now.Add(-time.Duration(1) * time.Hour)})
	}

	// A couple of starter notifications for ariac (a natural first login).
	aria := byName["ariac"]
	malik := byName["malikux"]
	fernweg := portfolioByTitle["Fernweg Travel App"]
	lumen := portfolioByTitle["Lumen Dashboard"]
	gdb.Create(&Notification{UserID: aria.ID, ActorID: &malik.ID, Kind: "like", Message: "liked your latest version “Portfolio Site v2”.", PortfolioID: &fernweg.ID, CreatedAt: now.Add(-2 * time.Hour)})
	gdb.Create(&Notification{UserID: aria.ID, ActorID: &malik.ID, Kind: "roast", Message: "posted a roast on “Lumen Dashboard v3”.", PortfolioID: &lumen.ID, Read: true, CreatedAt: now.Add(-8 * time.Hour)})

	return nil
}
