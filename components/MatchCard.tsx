"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, formatMatchDate, formatTime, getStatusBadgeClass } from "@/lib/utils";
import type { MatchSummary } from "@/lib/types";

interface MatchCardProps {
  match: MatchSummary;
  showLeague?: boolean;
}

export function MatchCard({ match, showLeague = false }: MatchCardProps) {
  const isFinished =
    match.statusShort === "FT" ||
    match.statusShort === "AET" ||
    match.statusShort === "PEN";
  const isLive =
    match.statusShort === "1H" ||
    match.statusShort === "2H" ||
    match.statusShort === "HT" ||
    match.statusShort === "ET" ||
    match.statusShort === "LIVE";
  const isScheduled = match.statusShort === "NS" || match.statusShort === "TBD";

  return (
    <Link
      href={`/match/${match.id}`}
      className={cn(
        "block rounded-xl border border-border bg-white/[0.02] p-4",
        "transition-all duration-200 hover:border-accent/40 hover:bg-white/[0.04]",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5",
        "focus:outline-none focus:ring-2 focus:ring-accent/50"
      )}
    >
      {/* League info */}
      {showLeague && match.league && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
          <Image
            src={match.league.logo}
            alt={match.league.name}
            width={20}
            height={20}
            className="rounded"
            unoptimized
          />
          <span className="text-xs text-muted truncate">{match.league.name}</span>
        </div>
      )}

      {/* Home team */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-10 h-10 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
            <Image
              src={match.home.logo}
              alt={match.home.name}
              width={28}
              height={28}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="font-medium text-slate-200 truncate">
            {match.home.name}
          </span>
        </div>
        <span
          className={cn(
            "text-lg font-bold tabular-nums min-w-[2rem] text-right",
            isFinished || isLive ? "text-slate-100" : "text-muted"
          )}
        >
          {match.score.home ?? "-"}
        </span>
      </div>

      {/* Away team */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-10 h-10 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
            <Image
              src={match.away.logo}
              alt={match.away.name}
              width={28}
              height={28}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="font-medium text-slate-200 truncate">
            {match.away.name}
          </span>
        </div>
        <span
          className={cn(
            "text-lg font-bold tabular-nums min-w-[2rem] text-right",
            isFinished || isLive ? "text-slate-100" : "text-muted"
          )}
        >
          {match.score.away ?? "-"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="text-xs text-muted">
          {formatMatchDate(match.date)}
          {isScheduled && ` • ${formatTime(match.date)}`}
        </div>
        <div
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full border",
            getStatusBadgeClass(match.statusShort)
          )}
        >
          {match.statusShort}
        </div>
      </div>
    </Link>
  );
}
