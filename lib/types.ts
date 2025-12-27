// ============================================
// NORMALIZED TYPES - UI Components consume ONLY these
// ============================================

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
}

export interface MatchSummary {
  id: number;
  date: string;
  status: string;
  statusShort: string;
  home: TeamInfo;
  away: TeamInfo;
  score: {
    home: number | null;
    away: number | null;
    htHome: number | null;
    htAway: number | null;
  };
  league?: {
    id: number;
    name: string;
    logo: string;
    country: string;
    season: number;
  };
  venue?: string;
}

export interface Player {
  id: number;
  name: string;
  number: number | null;
  position: string;
  photo: string | null;
  grid: string | null;
}

export interface Coach {
  id: number;
  name: string;
  photo: string | null;
}

export interface TeamLineup {
  team: TeamInfo;
  formation: string | null;
  coach: Coach | null;
  startingXI: Player[];
  substitutes: Player[];
  colors?: {
    player?: { primary: string; number: string; border: string };
    goalkeeper?: { primary: string; number: string; border: string };
  };
}

export interface MatchEvent {
  id: string;
  minute: number;
  extraMinute: number | null;
  type: "goal" | "card" | "subst" | "var" | "other";
  detail: string;
  team: TeamInfo;
  player: { id: number; name: string } | null;
  assist: { id: number; name: string } | null;
  comments: string | null;
}

export interface MatchStat {
  type: string;
  home: string | number | null;
  away: string | number | null;
}

export interface MatchDetails {
  header: {
    id: number;
    date: string;
    status: string;
    statusShort: string;
    home: TeamInfo;
    away: TeamInfo;
    score: {
      home: number | null;
      away: number | null;
      htHome: number | null;
      htAway: number | null;
    };
    league?: {
      id: number;
      name: string;
      logo: string;
      country: string;
      season: number;
    };
    venue?: string;
    referee?: string;
  };
  lineups: {
    home: TeamLineup | null;
    away: TeamLineup | null;
  } | null;
  events: MatchEvent[];
  stats: MatchStat[] | null;
}

// ============================================
// API-FOOTBALL RAW TYPES (for internal use)
// ============================================

export interface APIFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface APILineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: {
      player?: { primary: string; number: string; border: string };
      goalkeeper?: { primary: string; number: string; border: string };
    } | null;
  };
  coach: {
    id: number;
    name: string;
    photo: string | null;
  } | null;
  formation: string | null;
  startXI: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string | null;
    };
  }>;
  substitutes: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string | null;
    };
  }>;
}

export interface APIEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments: string | null;
}

export interface APIStat {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: Array<{
    type: string;
    value: string | number | null;
  }>;
}

export interface APIPlayer {
  player: {
    id: number;
    name: string;
    photo: string;
  };
}

// ============================================
// LEAGUE DATA
// ============================================

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  type: string;
}

export const POPULAR_LEAGUES: League[] = [
  { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", type: "League" },
  { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", type: "League" },
  { id: 78, name: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png", type: "League" },
  { id: 135, name: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png", type: "League" },
  { id: 61, name: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png", type: "League" },
  { id: 2, name: "Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", type: "Cup" },
  { id: 3, name: "Europa League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/3.png", type: "Cup" },
  { id: 848, name: "Conference League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/848.png", type: "Cup" },
];

// ============================================
// API RESPONSE WRAPPERS
// ============================================

export interface APIResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: string[] | Record<string, string>;
  results: number;
  paging: { current: number; total: number };
  response: T;
}
