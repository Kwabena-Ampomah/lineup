# LineupPitch 

A Next.js 14 (App Router) TypeScript + Tailwind CSS application for viewing football match lineups with beautiful pitch visualizations. Built for deployment on Vercel with API-Football (API-Sports) v3.

## Features

- **Recent Matches Feed**: Browse latest finished fixtures from top leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, etc.)
- **Match Details**: View comprehensive match information including:
  - Lineups with FIFA-style player cards on an interactive pitch
  - Match timeline with goals, cards, and substitutions
  - Match statistics comparison
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Skeleton Loaders**: Prevents layout shift during data loading
- **Error Handling**: Clear error states with retry functionality
- **Edge Runtime**: All API routes run on Vercel Edge for optimal performance
- **Aggressive Caching**: Smart cache headers for fast responses

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: API-Football (API-Sports) v3
- **Deployment**: Vercel (Edge Runtime)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API-Football API key (get one at [api-football.com](https://www.api-football.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd lineup
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your API key to `.env.local`:
   ```env
   API_FOOTBALL_KEY=your_api_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_FOOTBALL_KEY` | Your API-Football API key | Yes |

## Project Structure

```
lineup/
├── app/
│   ├── api/
│   │   ├── fixture/[id]/           # Match details API routes
│   │   │   ├── route.ts            # GET /api/fixture/[id]
│   │   │   ├── lineups/route.ts    # GET /api/fixture/[id]/lineups
│   │   │   ├── events/route.ts     # GET /api/fixture/[id]/events
│   │   │   └── statistics/route.ts # GET /api/fixture/[id]/statistics
│   │   ├── players/route.ts        # Player photos endpoint
│   │   └── recent/route.ts         # GET /api/recent?league=X&season=Y
│   ├── match/[fixtureId]/
│   │   └── page.tsx                # Match details page
│   ├── globals.css                 # Global styles + Tailwind
│   ├── layout.tsx                  # Root layout with navigation
│   └── page.tsx                    # Home page (recent matches)
├── components/
│   ├── ui/
│   │   ├── Select.tsx              # Dropdown & toggle components
│   │   ├── Skeleton.tsx            # Loading skeleton components
│   │   ├── States.tsx              # Error & empty state components
│   │   └── Tabs.tsx                # Tab navigation component
│   ├── formationTemplates.ts       # Formation position mappings
│   ├── positionMapper.ts           # Player position to slot mapping
│   ├── MatchCard.tsx               # Match summary card
│   ├── Pitch.tsx                   # Soccer pitch with player cards
│   ├── PlayerCard.tsx              # FIFA-style player card
│   ├── SquadList.tsx               # Starting XI & bench list
│   ├── Stats.tsx                   # Match statistics display
│   └── Timeline.tsx                # Match events timeline
├── lib/
│   ├── api-football.ts             # API helper functions
│   ├── normalizers.ts              # Data normalization utilities
│   ├── types.ts                    # TypeScript type definitions
│   └── utils.ts                    # Utility functions
├── tailwind.config.ts              # Tailwind configuration
├── next.config.js                  # Next.js configuration
└── package.json
```

## API Routes

All API routes use Edge Runtime with caching headers for optimal performance.

| Endpoint | Description |
|----------|-------------|
| `GET /api/recent` | Fetch recent/upcoming matches |
| `GET /api/fixture/[id]` | Get match summary |
| `GET /api/fixture/[id]/lineups` | Get match lineups |
| `GET /api/fixture/[id]/events` | Get match events |
| `GET /api/fixture/[id]/statistics` | Get match statistics |
| `GET /api/players` | Get player photos (cached) |

### Query Parameters

**`/api/recent`**
- `league` (required): League ID
- `season` (optional): Season year (default: current)
- `limit` (optional): Max results (default: 25)
- `status` (optional): Match status filter (default: FT)
- `upcoming` (optional): Show upcoming matches (default: false)

## Deployment on Vercel

1. Push your code to GitHub

2. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variable: `API_FOOTBALL_KEY`

3. Deploy!

The app automatically uses Edge Runtime for API routes, providing:
- Low latency responses
- Automatic scaling
- Built-in caching

## Supported Formations

The app supports all common formations including:
- 4-3-3, 4-4-2, 4-2-3-1
- 3-5-2, 3-4-3
- 5-3-2, 5-4-1
- 4-1-4-1, 4-3-1-2, 4-4-1-1, 4-5-1

Unknown formations are automatically parsed from the formation string.

## Design Decisions

1. **UI Reliability First**: All components handle missing data gracefully with fallbacks
2. **Historical Data Focus**: Defaults to finished matches (FT) as they have complete data
3. **Normalized Types**: API responses are normalized to stable types before reaching UI
4. **Edge Runtime**: Faster cold starts and lower latency than serverless functions
5. **Aggressive Caching**: Match data cached for 5-10 minutes, lineups/stats cached longer

## License

MIT
