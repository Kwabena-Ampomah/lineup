"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pitch, EmptyPitch } from "@/components/Pitch";
import { SquadList } from "@/components/SquadList";
import { Timeline } from "@/components/Timeline";
import { Stats } from "@/components/Stats";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { MatchDetailsSkeleton, PitchSkeleton } from "@/components/ui/Skeleton";
import { ErrorState, NoDataMessage } from "@/components/ui/States";
import {
  cn,
  formatDate,
  formatTime,
  getStatusBadgeClass,
} from "@/lib/utils";
import type {
  MatchSummary,
  TeamLineup,
  MatchEvent,
  MatchStat,
} from "@/lib/types";

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export default function MatchPage() {
  const params = useParams<{ fixtureId: string }>();
  const fixtureId = params?.fixtureId;

  // Data states
  const [match, setMatch] = useState<MatchSummary | null>(null);
  const [lineups, setLineups] = useState<{
    home: TeamLineup | null;
    away: TeamLineup | null;
  } | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [stats, setStats] = useState<MatchStat[] | null>(null);

  // Loading states
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingLineups, setLoadingLineups] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Error states
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState("lineups");
  const [activePitchTeam, setActivePitchTeam] = useState<"home" | "away">("home");

  // Fetch match details
  const fetchMatch = useCallback(async () => {
    if (!fixtureId) return;

    setLoadingMatch(true);
    try {
      const res = await fetch(`/api/fixture/${fixtureId}`);
      const data: APIResponse<MatchSummary> = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load match");
      }

      setMatch(data.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load match");
    } finally {
      setLoadingMatch(false);
    }
  }, [fixtureId]);

  // Fetch lineups
  const fetchLineups = useCallback(async () => {
    if (!fixtureId) return;

    setLoadingLineups(true);
    try {
      const res = await fetch(`/api/fixture/${fixtureId}/lineups`);
      const data: APIResponse<{ home: TeamLineup | null; away: TeamLineup | null }> =
        await res.json();

      if (data.success) {
        setLineups(data.data || null);
      }
    } catch {
      // Silently fail - lineups not available
    } finally {
      setLoadingLineups(false);
    }
  }, [fixtureId]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    if (!fixtureId) return;

    setLoadingEvents(true);
    try {
      const res = await fetch(`/api/fixture/${fixtureId}/events`);
      const data: APIResponse<MatchEvent[]> = await res.json();

      if (data.success) {
        setEvents(data.data || []);
      }
    } catch {
      // Silently fail
    } finally {
      setLoadingEvents(false);
    }
  }, [fixtureId]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!fixtureId) return;

    setLoadingStats(true);
    try {
      const res = await fetch(`/api/fixture/${fixtureId}/statistics`);
      const data: APIResponse<MatchStat[] | null> = await res.json();

      if (data.success) {
        setStats(data.data || null);
      }
    } catch {
      // Silently fail
    } finally {
      setLoadingStats(false);
    }
  }, [fixtureId]);

  // Load all data
  useEffect(() => {
    fetchMatch();
    fetchLineups();
    fetchEvents();
    fetchStats();
  }, [fetchMatch, fetchLineups, fetchEvents, fetchStats]);

  // Loading state
  if (loadingMatch) {
    return <MatchDetailsSkeleton />;
  }

  // Error state
  if (error || !match) {
    return (
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to matches
        </Link>
        <ErrorState
          message={error || "Match not found"}
          retry={fetchMatch}
        />
      </div>
    );
  }

  const isFinished = ["FT", "AET", "PEN"].includes(match.statusShort);
  const activeLineup =
    activePitchTeam === "home" ? lineups?.home : lineups?.away;

  const tabs = [
    {
      id: "lineups",
      label: "Lineups",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "stats",
      label: "Stats",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to matches
      </Link>

      {/* Sticky match header */}
      <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-bg/90 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {/* Home team */}
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <Image
                  src={match.home.logo}
                  alt={match.home.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-sm sm:text-base font-medium text-center truncate max-w-full">
                {match.home.name}
              </span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-3xl sm:text-4xl font-bold tabular-nums">
                  {match.score.home ?? "-"}
                </span>
                <span className="text-xl text-muted">-</span>
                <span className="text-3xl sm:text-4xl font-bold tabular-nums">
                  {match.score.away ?? "-"}
                </span>
              </div>

              {/* Half-time score */}
              {isFinished &&
                match.score.htHome !== null &&
                match.score.htAway !== null && (
                  <div className="text-xs text-muted">
                    HT: {match.score.htHome} - {match.score.htAway}
                  </div>
                )}

              {/* Status badge */}
              <div
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full border mt-1",
                  getStatusBadgeClass(match.statusShort)
                )}
              >
                {match.status}
              </div>
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                <Image
                  src={match.away.logo}
                  alt={match.away.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-sm sm:text-base font-medium text-center truncate max-w-full">
                {match.away.name}
              </span>
            </div>
          </div>

          {/* Match info */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted">
            {match.league && (
              <div className="flex items-center gap-1.5">
                <Image
                  src={match.league.logo}
                  alt={match.league.name}
                  width={16}
                  height={16}
                  className="rounded"
                  unoptimized
                />
                <span>{match.league.name}</span>
              </div>
            )}
            <span>•</span>
            <span>{formatDate(match.date)}</span>
            <span>•</span>
            <span>{formatTime(match.date)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="min-h-[400px]">
        {/* Lineups tab */}
        <TabPanel id="lineups" activeTab={activeTab}>
          <div className="space-y-6">
            {/* Team toggle for pitch */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setActivePitchTeam("home")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  activePitchTeam === "home"
                    ? "bg-accent/20 border-accent/50 text-accent"
                    : "bg-white/[0.02] border-border text-muted hover:text-slate-200"
                )}
              >
                <Image
                  src={match.home.logo}
                  alt={match.home.name}
                  width={20}
                  height={20}
                  className="rounded"
                  unoptimized
                />
                <span className="text-sm font-medium">{match.home.name}</span>
              </button>
              <button
                onClick={() => setActivePitchTeam("away")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  activePitchTeam === "away"
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                    : "bg-white/[0.02] border-border text-muted hover:text-slate-200"
                )}
              >
                <Image
                  src={match.away.logo}
                  alt={match.away.name}
                  width={20}
                  height={20}
                  className="rounded"
                  unoptimized
                />
                <span className="text-sm font-medium">{match.away.name}</span>
              </button>
            </div>

            {/* Pitch visualization */}
            <div className="max-w-md mx-auto">
              {loadingLineups ? (
                <PitchSkeleton />
              ) : activeLineup ? (
                <Pitch lineup={activeLineup} side={activePitchTeam} />
              ) : (
                <EmptyPitch message="Lineups not available for this match" />
              )}
            </div>

            {/* Squad lists */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Home squad */}
              <div className="rounded-xl border border-border bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                  <Image
                    src={match.home.logo}
                    alt={match.home.name}
                    width={24}
                    height={24}
                    className="rounded"
                    unoptimized
                  />
                  <span className="font-semibold">{match.home.name}</span>
                </div>
                {loadingLineups ? (
                  <div className="space-y-2">
                    {[...Array(11)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 skeleton rounded-lg"
                      />
                    ))}
                  </div>
                ) : lineups?.home ? (
                  <SquadList lineup={lineups.home} />
                ) : (
                  <NoDataMessage message="Lineup not available" />
                )}
              </div>

              {/* Away squad */}
              <div className="rounded-xl border border-border bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                  <Image
                    src={match.away.logo}
                    alt={match.away.name}
                    width={24}
                    height={24}
                    className="rounded"
                    unoptimized
                  />
                  <span className="font-semibold">{match.away.name}</span>
                </div>
                {loadingLineups ? (
                  <div className="space-y-2">
                    {[...Array(11)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 skeleton rounded-lg"
                      />
                    ))}
                  </div>
                ) : lineups?.away ? (
                  <SquadList lineup={lineups.away} />
                ) : (
                  <NoDataMessage message="Lineup not available" />
                )}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Timeline tab */}
        <TabPanel id="timeline" activeTab={activeTab}>
          <div className="rounded-xl border border-border bg-white/[0.02] p-4">
            {loadingEvents ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 skeleton rounded-lg" />
                ))}
              </div>
            ) : (
              <Timeline
                events={events}
                homeTeam={match.home}
                awayTeam={match.away}
              />
            )}
          </div>
        </TabPanel>

        {/* Stats tab */}
        <TabPanel id="stats" activeTab={activeTab}>
          <div className="rounded-xl border border-border bg-white/[0.02] p-4">
            {loadingStats ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-8 skeleton rounded-lg" />
                ))}
              </div>
            ) : (
              <Stats
                stats={stats}
                homeTeam={match.home}
                awayTeam={match.away}
              />
            )}
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
