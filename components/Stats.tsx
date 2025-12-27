"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { NoDataMessage } from "./ui/States";
import type { MatchStat, TeamInfo } from "@/lib/types";

interface StatsProps {
  stats: MatchStat[] | null;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

function parseStatValue(value: string | number | null): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

  // Handle percentage strings like "65%"
  const percentMatch = value.match(/^(\d+(?:\.\d+)?)\s*%?$/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]);
  }

  return 0;
}

function formatStatValue(value: string | number | null): string {
  if (value === null || value === undefined) return "-";
  return String(value);
}

function getStatLabel(type: string): string {
  const labels: Record<string, string> = {
    "Ball Possession": "Possession",
    "Total Shots": "Shots",
    "Shots on Goal": "On Target",
    "Shots off Goal": "Off Target",
    "Blocked Shots": "Blocked",
    "Shots insidebox": "Inside Box",
    "Shots outsidebox": "Outside Box",
    "Corner Kicks": "Corners",
    "Offsides": "Offsides",
    "Fouls": "Fouls",
    "Yellow Cards": "Yellow Cards",
    "Red Cards": "Red Cards",
    "Goalkeeper Saves": "GK Saves",
    "Total passes": "Passes",
    "Passes accurate": "Accurate Passes",
    "Passes %": "Pass Accuracy",
    "expected_goals": "xG",
  };
  return labels[type] || type;
}

export function Stats({ stats, homeTeam, awayTeam }: StatsProps) {
  if (!stats || stats.length === 0) {
    return <NoDataMessage message="No statistics available for this match" />;
  }

  // Filter to show most relevant stats first
  const priorityStats = [
    "Ball Possession",
    "Total Shots",
    "Shots on Goal",
    "Corner Kicks",
    "Fouls",
    "Yellow Cards",
    "Red Cards",
    "Offsides",
    "Goalkeeper Saves",
    "Total passes",
    "Passes accurate",
    "Passes %",
  ];

  const sortedStats = [...stats].sort((a, b) => {
    const aIndex = priorityStats.indexOf(a.type);
    const bIndex = priorityStats.indexOf(b.type);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-4">
      {/* Team headers */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-lg">
        <div className="flex items-center gap-2">
          <Image
            src={homeTeam.logo}
            alt={homeTeam.name}
            width={24}
            height={24}
            className="object-contain"
            unoptimized
          />
          <span className="font-medium text-sm truncate max-w-[100px]">
            {homeTeam.name}
          </span>
        </div>
        <div className="text-xs text-muted uppercase tracking-wider">VS</div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate max-w-[100px] text-right">
            {awayTeam.name}
          </span>
          <Image
            src={awayTeam.logo}
            alt={awayTeam.name}
            width={24}
            height={24}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Stats rows */}
      <div className="space-y-3">
        {sortedStats.map((stat) => {
          const homeValue = parseStatValue(stat.home);
          const awayValue = parseStatValue(stat.away);
          const total = homeValue + awayValue || 1;
          const homePercent = (homeValue / total) * 100;
          const awayPercent = (awayValue / total) * 100;

          return (
            <div key={stat.type} className="space-y-1.5">
              {/* Stat label */}
              <div className="text-center text-xs text-muted">
                {getStatLabel(stat.type)}
              </div>

              {/* Stat bars */}
              <div className="flex items-center gap-2">
                {/* Home value */}
                <div className="w-12 text-right text-sm font-medium tabular-nums">
                  {formatStatValue(stat.home)}
                </div>

                {/* Bar */}
                <div className="flex-1 flex h-2 rounded-full overflow-hidden bg-white/5">
                  {/* Home bar */}
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-l-full",
                      homeValue > awayValue ? "bg-accent" : "bg-accent/50"
                    )}
                    style={{ width: `${homePercent}%` }}
                  />
                  {/* Gap */}
                  <div className="w-px bg-panel" />
                  {/* Away bar */}
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-r-full",
                      awayValue > homeValue ? "bg-blue-400" : "bg-blue-400/50"
                    )}
                    style={{ width: `${awayPercent}%` }}
                  />
                </div>

                {/* Away value */}
                <div className="w-12 text-left text-sm font-medium tabular-nums">
                  {formatStatValue(stat.away)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
