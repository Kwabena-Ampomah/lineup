import type {
  APIFixture,
  APILineup,
  APIEvent,
  APIStat,
  MatchSummary,
  MatchDetails,
  MatchEvent,
  MatchStat,
  TeamLineup,
  Player,
} from "./types";

// Placeholder image for missing logos/photos
const PLACEHOLDER_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%231f2937' width='64' height='64' rx='8'/%3E%3Ctext x='32' y='38' text-anchor='middle' fill='%2394a3b8' font-size='20' font-family='sans-serif'%3E?%3C/text%3E%3C/svg%3E";

export function normalizeFixtureToSummary(fixture: APIFixture): MatchSummary {
  return {
    id: fixture.fixture.id,
    date: fixture.fixture.date,
    status: fixture.fixture.status.long,
    statusShort: fixture.fixture.status.short,
    home: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      logo: fixture.teams.home.logo || PLACEHOLDER_LOGO,
    },
    away: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      logo: fixture.teams.away.logo || PLACEHOLDER_LOGO,
    },
    score: {
      home: fixture.goals.home,
      away: fixture.goals.away,
      htHome: fixture.score.halftime.home,
      htAway: fixture.score.halftime.away,
    },
    league: {
      id: fixture.league.id,
      name: fixture.league.name,
      logo: fixture.league.logo || PLACEHOLDER_LOGO,
      country: fixture.league.country,
      season: fixture.league.season,
    },
    venue: fixture.fixture.venue.name || undefined,
  };
}

export function normalizeLineup(
  lineup: APILineup,
  playerPhotos: Record<number, string> = {}
): TeamLineup {
  const normalizePlayer = (
    p: APILineup["startXI"][0]["player"]
  ): Player => ({
    id: p.id,
    name: p.name,
    number: p.number ?? null,
    position: p.pos || "?",
    photo: playerPhotos[p.id] || null,
    grid: p.grid || null,
  });

  return {
    team: {
      id: lineup.team.id,
      name: lineup.team.name,
      logo: lineup.team.logo || PLACEHOLDER_LOGO,
    },
    formation: lineup.formation || null,
    coach: lineup.coach
      ? {
          id: lineup.coach.id,
          name: lineup.coach.name,
          photo: lineup.coach.photo || null,
        }
      : null,
    startingXI: (lineup.startXI || []).map((p) => normalizePlayer(p.player)),
    substitutes: (lineup.substitutes || []).map((p) => normalizePlayer(p.player)),
    colors: lineup.team.colors
      ? {
          player: lineup.team.colors.player,
          goalkeeper: lineup.team.colors.goalkeeper,
        }
      : undefined,
  };
}

export function normalizeEvent(event: APIEvent, index: number): MatchEvent {
  const typeMap: Record<string, MatchEvent["type"]> = {
    Goal: "goal",
    Card: "card",
    subst: "subst",
    Var: "var",
  };

  return {
    id: `${event.time.elapsed}-${event.type}-${index}`,
    minute: event.time.elapsed,
    extraMinute: event.time.extra,
    type: typeMap[event.type] || "other",
    detail: event.detail,
    team: {
      id: event.team.id,
      name: event.team.name,
      logo: event.team.logo || PLACEHOLDER_LOGO,
    },
    player: event.player?.id
      ? { id: event.player.id, name: event.player.name }
      : null,
    assist:
      event.assist?.id && event.assist?.name
        ? { id: event.assist.id, name: event.assist.name }
        : null,
    comments: event.comments,
  };
}

export function normalizeStats(
  homeStats: APIStat | undefined,
  awayStats: APIStat | undefined
): MatchStat[] | null {
  if (!homeStats || !awayStats) return null;

  const statMap = new Map<string, { home: string | number | null; away: string | number | null }>();

  homeStats.statistics.forEach((s) => {
    statMap.set(s.type, { home: s.value, away: null });
  });

  awayStats.statistics.forEach((s) => {
    const existing = statMap.get(s.type);
    if (existing) {
      existing.away = s.value;
    } else {
      statMap.set(s.type, { home: null, away: s.value });
    }
  });

  const result: MatchStat[] = [];
  statMap.forEach((value, key) => {
    result.push({
      type: key,
      home: value.home,
      away: value.away,
    });
  });

  return result.length > 0 ? result : null;
}

export function normalizeMatchDetails(
  fixture: APIFixture,
  lineups: APILineup[] | null,
  events: APIEvent[],
  stats: APIStat[] | null,
  playerPhotos: Record<number, string> = {}
): MatchDetails {
  const homeLineup = lineups?.find((l) => l.team.id === fixture.teams.home.id);
  const awayLineup = lineups?.find((l) => l.team.id === fixture.teams.away.id);

  return {
    header: {
      id: fixture.fixture.id,
      date: fixture.fixture.date,
      status: fixture.fixture.status.long,
      statusShort: fixture.fixture.status.short,
      home: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
        logo: fixture.teams.home.logo || PLACEHOLDER_LOGO,
      },
      away: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
        logo: fixture.teams.away.logo || PLACEHOLDER_LOGO,
      },
      score: {
        home: fixture.goals.home,
        away: fixture.goals.away,
        htHome: fixture.score.halftime.home,
        htAway: fixture.score.halftime.away,
      },
      league: {
        id: fixture.league.id,
        name: fixture.league.name,
        logo: fixture.league.logo || PLACEHOLDER_LOGO,
        country: fixture.league.country,
        season: fixture.league.season,
      },
      venue: fixture.fixture.venue.name || undefined,
      referee: fixture.fixture.referee || undefined,
    },
    lineups:
      homeLineup || awayLineup
        ? {
            home: homeLineup ? normalizeLineup(homeLineup, playerPhotos) : null,
            away: awayLineup ? normalizeLineup(awayLineup, playerPhotos) : null,
          }
        : null,
    events: (events || []).map((e, i) => normalizeEvent(e, i)),
    stats: stats
      ? normalizeStats(
          stats.find((s) => s.team.id === fixture.teams.home.id),
          stats.find((s) => s.team.id === fixture.teams.away.id)
        )
      : null,
  };
}
