import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://v3.football.api-sports.io";

const defaultSeason = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // 1-based
  return month >= 7 ? year : year - 1;
};

export async function GET(request: NextRequest) {
  const team = request.nextUrl.searchParams.get("team");
  const last = request.nextUrl.searchParams.get("last") ?? "10";
  const seasonParam = request.nextUrl.searchParams.get("season");

  if (!team) {
    return NextResponse.json({ error: "Missing team query" }, { status: 400 });
  }

  const apiKey = process.env.APISPORTS_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "APISPORTS_KEY is not configured" },
      { status: 500 },
    );
  }

  const fetchForSeason = async (season: string) => {
    const params = new URLSearchParams({
      team,
      last,
      season,
    });
    const res = await fetch(`${API_BASE}/fixtures?${params.toString()}`, {
      headers: {
        "x-apisports-key": apiKey,
      },
      cache: "no-store",
    });
    const data = await res.json();
    return { res, data };
  };

  try {
    if (seasonParam) {
      const { res, data } = await fetchForSeason(seasonParam);
      return NextResponse.json(data, { status: res.ok ? 200 : res.status });
    }

    const seasonsToTry = [defaultSeason(), defaultSeason() - 1];
    for (const season of seasonsToTry) {
      const { res, data } = await fetchForSeason(String(season));
      if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
      }
      if (data?.response?.length) {
        return NextResponse.json(data, { status: 200 });
      }
      // If empty, continue to next season candidate
    }

    // If both seasons return empty, return the latest attempt (previous season)
    const { data } = await fetchForSeason(String(seasonsToTry[0]));
    return NextResponse.json(
      {
        ...data,
        warning: "No fixtures found for current or previous season.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to reach API-Football", details: `${error}` },
      { status: 500 },
    );
  }
}
