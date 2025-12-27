const API_BASE = "https://v3.football.api-sports.io";

export function getApiKey(): string {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    throw new Error("API_FOOTBALL_KEY is not configured");
  }
  return key;
}

export function getCurrentSeason(): number {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  // Football seasons typically start in July/August
  return month >= 7 ? year : year - 1;
}

export async function fetchFromAPI<T>(
  endpoint: string,
  params: Record<string, string | number>
): Promise<T> {
  const apiKey = getApiKey();
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const url = `${API_BASE}${endpoint}?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey,
    },
    next: {
      revalidate: 60, // Cache for 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`API-Football error: ${response.status}`);
  }

  return response.json();
}

export function createCacheHeaders(maxAge: number = 60, staleWhileRevalidate: number = 300) {
  return {
    "Cache-Control": `s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json(
    { error: message, success: false },
    { status, headers: createCacheHeaders(0, 0) }
  );
}

export function createSuccessResponse<T>(data: T, maxAge: number = 60) {
  return Response.json(
    { data, success: true },
    { status: 200, headers: createCacheHeaders(maxAge) }
  );
}
