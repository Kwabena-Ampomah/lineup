import { NextRequest } from "next/server";
import {
  getApiKey,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-football";
import { normalizeLineup } from "@/lib/normalizers";
import type { APILineup, APIResponse, TeamLineup } from "@/lib/types";

export const runtime = "edge";

const API_BASE = "https://v3.football.api-sports.io";

interface SquadPlayer {
  id: number;
  name: string;
  photo: string;
}

interface SquadResponse {
  team: { id: number };
  players: SquadPlayer[];
}

async function fetchTeamPhotos(
  teamId: number,
  apiKey: string
): Promise<Record<number, string>> {
  const photos: Record<number, string> = {};

  try {
    const url = `${API_BASE}/players/squads?team=${teamId}`;
    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    if (!response.ok) return photos;

    const data: APIResponse<SquadResponse[]> = await response.json();

    if (data.response && data.response[0]?.players) {
      data.response[0].players.forEach((player) => {
        if (player.id && player.photo) {
          photos[player.id] = player.photo;
        }
      });
    }
  } catch {
    // Silently fail - will use fallback avatars
  }

  return photos;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fixtureId = params.id;

    if (!fixtureId || isNaN(Number(fixtureId))) {
      return createErrorResponse("Invalid fixture ID", 400);
    }

    let apiKey: string;
    try {
      apiKey = getApiKey();
    } catch {
      return createErrorResponse("API key not configured", 500);
    }

    // Fetch lineups
    const lineupsUrl = `${API_BASE}/fixtures/lineups?fixture=${fixtureId}`;
    const lineupsResponse = await fetch(lineupsUrl, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    if (!lineupsResponse.ok) {
      return createErrorResponse(`API error: ${lineupsResponse.status}`, lineupsResponse.status);
    }

    const lineupsData: APIResponse<APILineup[]> = await lineupsResponse.json();

    if (!lineupsData.response || lineupsData.response.length === 0) {
      // Return null for lineups if not available - this is expected for some matches
      return createSuccessResponse({ home: null, away: null }, 300);
    }

    // Get team IDs to fetch photos
    const teamIds = lineupsData.response.map((lineup) => lineup.team.id);

    // Fetch player photos for both teams in parallel
    const photoPromises = teamIds.map((teamId) => fetchTeamPhotos(teamId, apiKey));
    const photoResults = await Promise.all(photoPromises);

    // Merge all photos into one map
    const playerPhotos: Record<number, string> = {};
    photoResults.forEach((photos) => {
      Object.assign(playerPhotos, photos);
    });

    // Normalize lineups with photos
    const lineups = lineupsData.response.map((lineup) =>
      normalizeLineup(lineup, playerPhotos)
    );

    // Separate into home and away
    const result: { home: TeamLineup | null; away: TeamLineup | null } = {
      home: lineups[0] || null,
      away: lineups[1] || null,
    };

    return createSuccessResponse(result, 600); // Cache lineups longer as they don't change
  } catch (error) {
    console.error("Lineups API error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch lineups",
      500
    );
  }
}
