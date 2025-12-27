import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://v3.football.api-sports.io";

const getApiKey = () => process.env.APISPORTS_KEY;

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search");
  if (!search) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "APISPORTS_KEY is not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${API_BASE}/teams?search=${encodeURIComponent(search)}`, {
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to reach API-Football", details: `${error}` },
      { status: 500 },
    );
  }
}
