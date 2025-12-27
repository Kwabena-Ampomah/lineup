"use client";

import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";
import type { Player, TeamLineup } from "@/lib/types";

interface SquadListProps {
  lineup: TeamLineup;
  className?: string;
}

function PlayerRow({ player, index }: { player: Player; index: number }) {
  const hasPhoto = !!player.photo;

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-2.5 px-3 rounded-lg",
        "hover:bg-white/[0.03] transition-colors"
      )}
    >
      {/* Position number */}
      <div className="w-6 text-sm text-muted font-mono text-center">
        {index + 1}
      </div>

      {/* Player photo/avatar */}
      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
        {hasPhoto ? (
          <Image
            src={player.photo!}
            alt={player.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted">
            {getInitials(player.name)}
          </div>
        )}
      </div>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200 truncate">
            {player.name}
          </span>
          {player.number && (
            <span className="text-xs text-muted bg-white/5 px-1.5 py-0.5 rounded">
              #{player.number}
            </span>
          )}
        </div>
      </div>

      {/* Position */}
      <div className="text-xs text-muted uppercase tracking-wider">
        {player.position}
      </div>
    </div>
  );
}

export function SquadList({ lineup, className }: SquadListProps) {
  const hasStartingXI = lineup.startingXI && lineup.startingXI.length > 0;
  const hasBench = lineup.substitutes && lineup.substitutes.length > 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Starting XI */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-3">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <h4 className="text-sm font-semibold text-slate-200">
            Starting XI
          </h4>
          {lineup.formation && (
            <span className="text-xs text-muted ml-auto">
              {lineup.formation}
            </span>
          )}
        </div>

        {hasStartingXI ? (
          <div className="divide-y divide-border/30">
            {lineup.startingXI.map((player, idx) => (
              <PlayerRow key={player.id} player={player} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted text-center py-6">
            Starting lineup not available
          </div>
        )}
      </div>

      {/* Substitutes */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-3">
          <div className="w-2 h-2 rounded-full bg-muted/50" />
          <h4 className="text-sm font-semibold text-slate-200">
            Substitutes
          </h4>
          {hasBench && (
            <span className="text-xs text-muted ml-auto">
              {lineup.substitutes.length} players
            </span>
          )}
        </div>

        {hasBench ? (
          <div className="divide-y divide-border/30">
            {lineup.substitutes.map((player, idx) => (
              <PlayerRow key={player.id} player={player} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted text-center py-6">
            Bench not available
          </div>
        )}
      </div>

      {/* Coach */}
      {lineup.coach && (
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
              {lineup.coach.photo ? (
                <Image
                  src={lineup.coach.photo}
                  alt={lineup.coach.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted">
                  {getInitials(lineup.coach.name)}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-wider mb-0.5">
                Manager
              </div>
              <div className="text-sm font-medium text-slate-200">
                {lineup.coach.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
