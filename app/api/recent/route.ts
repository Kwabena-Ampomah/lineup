import { NextRequest } from "next/server";
import {
  getApiKey,
  getCurrentSeason,
  createCacheHeaders,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-football";
import { normalizeFixtureToSummary } from "@/lib/normalizers";
import type { APIFixture, APIResponse, MatchSummary } from "@/lib/types";

export const runtime = "edge";

const API_BASE = "https://v3.football.api-sports.io";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const league = searchParams.get("league");
    const season = searchParams.get("season") || String(getCurrentSeason());
    const team = searchParams.get("team");
    const limit = Math.min(parseInt(searchParams.get("limit") || "25", 10), 100);
    const status = searchParams.get("status") || "FT"; // Default to finished matches
    const upcoming = searchParams.get("upcoming") === "true";

    if (!league && !team) {
      return createErrorResponse("Missing league or team parameter", 400);
    }

    let apiKey: string;
    try {
      apiKey = getApiKey();
    } catch {
      return createErrorResponse("API key not configured", 500);
    }

    const params = new URLSearchParams();
    params.set("season", season);

    if (league) {
      params.set("league", league);
    }
    if (team) {
      params.set("team", team);
    }

    // For finished matches, we use "last" to get most recent completed games
    // For upcoming matches, we use "next" or filter by status
    if (!upcoming) {
      // Get finished matches
      if (team) {
        params.set("last", String(limit));
      } else {
        // For league-based queries, filter by status
        params.set("status", status);
      }
    } else {
      // Get upcoming matches
      if (team) {
        params.set("next", String(limit));
      } else {
        params.set("status", "NS-1H-HT-2H-ET-P-BT-SUSP-INT-LIVE");
      }
    }

    const url = `${API_BASE}/fixtures?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    if (!response.ok) {
      return createErrorResponse(`API error: ${response.status}`, response.status);
    }

    const data: APIResponse<APIFixture[]> = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : Object.values(data.errors).join(", ");
      return createErrorResponse(errorMsg, 400);
    }

    // Normalize and sort fixtures
    let matches: MatchSummary[] = (data.response || []).map(normalizeFixtureToSummary);

    // Sort by date (newest first for past matches, oldest first for upcoming)
    matches.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return upcoming ? dateA - dateB : dateB - dateA;
    });

    // Apply limit
    matches = matches.slice(0, limit);

    return createSuccessResponse(matches, 120);
  } catch (error) {
    console.error("Recent matches API error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch matches",
      500
    );
  }
}
