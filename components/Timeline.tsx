"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { NoDataMessage } from "./ui/States";
import type { MatchEvent, TeamInfo } from "@/lib/types";

interface TimelineProps {
  events: MatchEvent[];
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

function getEventIcon(type: MatchEvent["type"], detail: string) {
  switch (type) {
    case "goal":
      if (detail.toLowerCase().includes("own")) {
        return (
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-xs">OG</span>
          </div>
        );
      }
      if (detail.toLowerCase().includes("penalty")) {
        return (
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs text-accent">P</span>
          </div>
        );
      }
      return (
        <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );

    case "card":
      if (detail.toLowerCase().includes("red")) {
        return (
          <div className="w-4 h-5 rounded-sm bg-red-500 shadow-lg" />
        );
      }
      if (detail.toLowerCase().includes("yellow")) {
        return (
          <div className="w-4 h-5 rounded-sm bg-yellow-400 shadow-lg" />
        );
      }
      return (
        <div className="w-4 h-5 rounded-sm bg-yellow-400 shadow-lg" />
      );

    case "subst":
      return (
        <div className="flex flex-col items-center">
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5H7z" />
          </svg>
          <svg className="w-4 h-4 text-red-400 -mt-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      );

    case "var":
      return (
        <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
          <span className="text-[10px] font-bold text-blue-400">VAR</span>
        </div>
      );

    default:
      return (
        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-[10px]">?</span>
        </div>
      );
  }
}

function formatMinute(minute: number, extra: number | null): string {
  if (extra) {
    return `${minute}+${extra}'`;
  }
  return `${minute}'`;
}

export function Timeline({ events, homeTeam, awayTeam }: TimelineProps) {
  if (!events || events.length === 0) {
    return <NoDataMessage message="No events available for this match" />;
  }

  // Group events by period (first half, second half, extra time)
  const firstHalf = events.filter((e) => e.minute <= 45);
  const secondHalf = events.filter((e) => e.minute > 45 && e.minute <= 90);
  const extraTime = events.filter((e) => e.minute > 90);

  const renderEvent = (event: MatchEvent) => {
    const isHome = event.team.id === homeTeam.id;

    return (
      <div
        key={event.id}
        className={cn(
          "flex items-center gap-3 py-3 px-4 rounded-lg",
          "bg-white/[0.02] border border-transparent",
          "hover:border-border hover:bg-white/[0.04] transition-all"
        )}
      >
        {/* Minute */}
        <div className="w-12 text-sm font-mono text-muted text-right flex-shrink-0">
          {formatMinute(event.minute, event.extraMinute)}
        </div>

        {/* Event icon */}
        <div className="flex-shrink-0 w-8 flex justify-center">
          {getEventIcon(event.type, event.detail)}
        </div>

        {/* Event details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Team logo */}
            <Image
              src={event.team.logo}
              alt={event.team.name}
              width={16}
              height={16}
              className="rounded"
              unoptimized
            />

            {/* Player name */}
            {event.player && (
              <span className="font-medium text-slate-200 truncate">
                {event.player.name}
              </span>
            )}
          </div>

          {/* Secondary info (assist, substituted player) */}
          {event.assist && (
            <div className="text-xs text-muted mt-0.5">
              {event.type === "subst" ? (
                <span className="text-red-400/80">Out: {event.assist.name}</span>
              ) : (
                <span>Assist: {event.assist.name}</span>
              )}
            </div>
          )}

          {/* Event detail */}
          {event.detail && event.type !== "subst" && (
            <div className="text-xs text-muted/70 mt-0.5">{event.detail}</div>
          )}
        </div>

        {/* Team side indicator */}
        <div
          className={cn(
            "w-1 h-8 rounded-full",
            isHome ? "bg-accent/50" : "bg-blue-400/50"
          )}
        />
      </div>
    );
  };

  const renderPeriod = (title: string, periodEvents: MatchEvent[]) => {
    if (periodEvents.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted uppercase tracking-wider">
            {title}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="space-y-1">
          {periodEvents.map(renderEvent)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-white/[0.02] rounded-lg text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span>Goal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-3.5 rounded-sm bg-yellow-400" />
          <span>Yellow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-3.5 rounded-sm bg-red-500" />
          <span>Red</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5H7z" />
          </svg>
          <span>Substitution</span>
        </div>
      </div>

      {/* Events by period */}
      {renderPeriod("First Half", firstHalf)}
      {renderPeriod("Second Half", secondHalf)}
      {extraTime.length > 0 && renderPeriod("Extra Time", extraTime)}
    </div>
  );
}
