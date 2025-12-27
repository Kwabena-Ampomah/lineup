import { NextRequest } from "next/server";
import {
  getApiKey,
  getCurrentSeason,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-football";
import type { APIResponse } from "@/lib/types";

export const runtime = "edge";

const API_BASE = "https://v3.football.api-sports.io";

interface APIPlayerData {
  player: {
    id: number;
    name: string;
    photo: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");
    const team = searchParams.get("team");
    const season = searchParams.get("season") || String(getCurrentSeason());

    if (!ids && !team) {
      return createErrorResponse("Missing ids or team parameter", 400);
    }

    let apiKey: string;
    try {
      apiKey = getApiKey();
    } catch {
      return createErrorResponse("API key not configured", 500);
    }

    const photos: Record<number, string> = {};

    // If team is provided, fetch all squad players (more efficient)
    if (team) {
      const url = `${API_BASE}/players/squads?team=${team}`;

      const response = await fetch(url, {
        headers: {
          "x-apisports-key": apiKey,
        },
      });

      if (!response.ok) {
        return createErrorResponse(`API error: ${response.status}`, response.status);
      }

      const data = await response.json();

      if (data.response && data.response[0]?.players) {
        data.response[0].players.forEach((p: { id: number; photo: string }) => {
          if (p.id && p.photo) {
            photos[p.id] = p.photo;
          }
        });
      }

      return createSuccessResponse(photos, 86400); // Cache for 24 hours
    }

    // If specific IDs provided, we can't batch them efficiently with API-Football
    // So we return empty and let the UI use fallback avatars
    // In production, you'd want to implement a caching layer for player photos
    return createSuccessResponse(photos, 86400);
  } catch (error) {
    console.error("Players API error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch players",
      500
    );
  }
}
