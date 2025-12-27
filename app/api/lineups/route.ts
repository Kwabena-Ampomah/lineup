import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://v3.football.api-sports.io";

export async function GET(request: NextRequest) {
  const fixture = request.nextUrl.searchParams.get("fixture");

  if (!fixture) {
    return NextResponse.json(
      { error: "Missing fixture query" },
      { status: 400 },
    );
  }

  const apiKey = process.env.APISPORTS_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "APISPORTS_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `${API_BASE}/fixtures/lineups?fixture=${encodeURIComponent(fixture)}`,
      {
        headers: {
          "x-apisports-key": apiKey,
        },
        cache: "no-store",
      },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to reach API-Football", details: `${error}` },
      { status: 500 },
    );
  }
}
