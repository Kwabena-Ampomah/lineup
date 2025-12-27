"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { MatchCard } from "@/components/MatchCard";
import { MatchCardSkeleton } from "@/components/ui/Skeleton";
import { Select, Toggle } from "@/components/ui/Select";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { getSeasonOptions } from "@/lib/utils";
import { POPULAR_LEAGUES, type MatchSummary } from "@/lib/types";

interface APIResponse {
  success: boolean;
  data?: MatchSummary[];
  error?: string;
}

export default function HomePage() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedLeague, setSelectedLeague] = useState("39"); // Premier League
  const [selectedSeason, setSelectedSeason] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return String(month >= 7 ? year : year - 1);
  });
  const [showUpcoming, setShowUpcoming] = useState(false);

  const leagueOptions = POPULAR_LEAGUES.map((league) => ({
    value: String(league.id),
    label: league.name,
  }));

  const seasonOptions = getSeasonOptions();

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        league: selectedLeague,
        season: selectedSeason,
        limit: "25",
        upcoming: String(showUpcoming),
      });

      const response = await fetch(`/api/recent?${params.toString()}`);
      const data: APIResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch matches");
      }

      setMatches(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLeague, selectedSeason, showUpcoming]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const selectedLeagueData = POPULAR_LEAGUES.find(
    (l) => String(l.id) === selectedLeague
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {showUpcoming ? "Upcoming Matches" : "Recent Matches"}
        </h1>
        <p className="text-muted">
          {showUpcoming
            ? "Scheduled fixtures from top leagues"
            : "Latest finished fixtures from top leagues"}
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-white/[0.02] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* League selector with logo */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-muted mb-1.5">League</label>
            <div className="relative">
              {selectedLeagueData && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <Image
                    src={selectedLeagueData.logo}
                    alt={selectedLeagueData.name}
                    width={20}
                    height={20}
                    className="rounded"
                    unoptimized
                  />
                </div>
              )}
              <Select
                value={selectedLeague}
                onChange={setSelectedLeague}
                options={leagueOptions}
                className={selectedLeagueData ? "pl-10" : ""}
              />
            </div>
          </div>

          {/* Season selector */}
          <div className="w-full sm:w-40">
            <label className="block text-xs text-muted mb-1.5">Season</label>
            <Select
              value={selectedSeason}
              onChange={setSelectedSeason}
              options={seasonOptions}
            />
          </div>

          {/* Upcoming toggle */}
          <div className="flex items-end">
            <Toggle
              enabled={showUpcoming}
              onChange={setShowUpcoming}
              label="Upcoming"
            />
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} retry={fetchMatches} />}

      {/* Loading state */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && matches.length === 0 && (
        <EmptyState
          icon={
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
          title="No matches found"
          description={`No ${showUpcoming ? "upcoming" : "recent"} matches found for this league and season. Try selecting a different league or season.`}
        />
      )}

      {/* Matches grid */}
      {!loading && !error && matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">
              {matches.length} match{matches.length !== 1 ? "es" : ""}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
