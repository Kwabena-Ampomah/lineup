import { NextRequest } from "next/server";
import {
  getApiKey,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/api-football";
import { normalizeEvent } from "@/lib/normalizers";
import type { APIEvent, APIResponse, MatchEvent } from "@/lib/types";

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

    const url = `${API_BASE}/fixtures/events?fixture=${fixtureId}`;

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    if (!response.ok) {
      return createErrorResponse(`API error: ${response.status}`, response.status);
    }

    const data: APIResponse<APIEvent[]> = await response.json();

    // Normalize events
    const events: MatchEvent[] = (data.response || []).map((event, index) =>
      normalizeEvent(event, index)
    );

    // Sort by minute
    events.sort((a, b) => {
      const minA = a.minute + (a.extraMinute || 0) * 0.01;
      const minB = b.minute + (b.extraMinute || 0) * 0.01;
      return minA - minB;
    });

    return createSuccessResponse(events, 600);
  } catch (error) {
    console.error("Events API error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch events",
      500
    );
  }
}
