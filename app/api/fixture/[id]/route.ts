import { NextRequest } from "next/server";
import {
  getApiKey,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-football";
import { normalizeFixtureToSummary } from "@/lib/normalizers";
import type { APIFixture, APIResponse, MatchSummary } from "@/lib/types";

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

    const url = `${API_BASE}/fixtures?id=${fixtureId}`;

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    if (!response.ok) {
      return createErrorResponse(`API error: ${response.status}`, response.status);
    }

    const data: APIResponse<APIFixture[]> = await response.json();

    if (!data.response || data.response.length === 0) {
      return createErrorResponse("Fixture not found", 404);
    }

    const match: MatchSummary = normalizeFixtureToSummary(data.response[0]);

    return createSuccessResponse(match, 300);
  } catch (error) {
    console.error("Fixture API error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch fixture",
      500
    );
  }
}
