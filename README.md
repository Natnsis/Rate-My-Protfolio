# Foliohub

Post your dev portfolio, ship new versions, and get real feedback from other developers — likes, comments, structured "roasts," a leaderboard, and an AI Studio that critiques your work on demand.

- `frontend/` — SvelteKit app (Svelte 5 runes, Tailwind).
- `backend/` — Go + Gin REST API (GORM + Postgres/Neon, JWT auth, Swagger).

## Running it locally

### 1. Backend

```
cd backend
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — a [Neon](https://neon.tech) Postgres connection string (or any Postgres). Until this is set to a real database, the server logs a warning and refuses to start.
- `JWT_SECRET` — any long random string.
- `ANTHROPIC_API_KEY` — optional; without it, AI Studio's `/api/ai/generate` responds with 503 instead of pretending to work.

```
go run .
```

On first run against an empty database, the server auto-migrates its schema and seeds demo users/portfolios/likes/comments/roasts (every seeded account's password is `password123`) so the app isn't empty on first login.

- API: `http://localhost:8080/api`
- Interactive API docs: `http://localhost:8080/swagger/index.html`

### 2. Frontend

```
cd frontend
cp .env.example .env   # defaults already point at the local backend
npm install
npm run dev
```

Open the printed local URL and sign up (or log in with a seeded account, e.g. `aria@devfolio.dev` / `password123`).

## Notes

- Auth is JWT-based: the frontend stores the token in `localStorage` and attaches it as `Authorization: Bearer <token>` on every API call (see `frontend/src/lib/api.ts` and `auth.svelte.ts`).
- There's no real screenshot-capture or file-upload pipeline yet — posting a portfolio pairs your write-up with a placeholder cover image.
