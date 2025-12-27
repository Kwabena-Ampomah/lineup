# LineupPitch

LineupPitch is a Next.js (App Router) app that lets fans search for a club, browse their recent fixtures, and view match lineups drawn directly on a soccer pitch.

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure API-Football
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and paste your API key
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`

## Notes

- API requests are proxied through `/app/api/*` route handlers so the `APISPORTS_KEY` is never exposed in the browser.
- Pages:
  - `/` search teams
  - `/team/[teamId]` last 10 fixtures
  - `/match/[fixtureId]` dual lineup pitch view
- If a lineup is missing, the UI will show "Lineup not available" and fall back to a neutral grid layout.
