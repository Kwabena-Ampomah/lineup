import { NextRequest } from "next/server";
import {
  getApiKey,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-football";
import { normalizeStats } from "@/lib/normalizers";
import type { APIStat, APIResponse, MatchStat } from "@/lib/types";

export const runtime = "edge";

const API_BASE = "https://v3.football.api-sports.io";

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

    const url = `${API_BASE}/fixtures/statistics?fixture=${fixtureId}`;

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    if (!response.ok) {
      return createErrorResponse(`API error: ${response.status}`, response.status);
    }

    const data: APIResponse<APIStat[]> = await response.json();

    if (!data.response || data.response.length < 2) {
      return createSuccessResponse(null, 600);
    }

    const stats: MatchStat[] | null = normalizeStats(
      data.response[0],
      data.response[1]
    );

    return createSuccessResponse(stats, 600);
  } catch (error) {
    console.error("Statistics API error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch statistics",
      500
    );
  }
}
