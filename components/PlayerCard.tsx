"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, getInitials, truncateName } from "@/lib/utils";
import type { Player } from "@/lib/types";

interface PlayerCardProps {
  player: Player;
  position: { x: number; y: number };
  color?: string;
  isGoalkeeper?: boolean;
}

export function PlayerCard({
  player,
  position,
  color = "#4ade80",
  isGoalkeeper = false,
}: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayName = truncateName(player.name, 10);
  const initials = getInitials(player.name);
  const hasPhoto = player.photo && !imageError;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Player Card */}
      <div
        className={cn(
          "player-card relative flex flex-col items-center",
          "transition-all duration-200",
          isHovered && "scale-110 z-20"
        )}
      >
        {/* Jersey number - positioned outside top-right */}
        {player.number && (
          <div
            className={cn(
              "absolute -top-1 -right-1 z-20",
              "w-5 h-5 rounded-full",
              "flex items-center justify-center text-[10px] font-bold",
              isGoalkeeper
                ? "bg-amber-500 text-black"
                : "bg-accent text-black",
              "shadow-md"
            )}
          >
            {player.number}
          </div>
        )}

        {/* Photo/Avatar Circle */}
        <div
          className={cn(
            "relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden",
            "border-2 shadow-lg",
            isGoalkeeper ? "border-amber-400" : "border-white/40",
            "bg-gradient-to-br",
            isGoalkeeper
              ? "from-amber-500/80 to-amber-700/90"
              : "from-slate-600/80 to-slate-800/90"
          )}
        >
          {hasPhoto ? (
            <Image
              src={player.photo!}
              alt={player.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
          )}

          {/* Shine effect */}
          <div className="player-card-shine absolute inset-0 pointer-events-none" />
        </div>

        {/* Name plate */}
        <div
          className={cn(
            "mt-1 px-1.5 py-0.5 rounded text-center",
            "bg-black/70 backdrop-blur-sm border border-white/10",
            "max-w-[70px]"
          )}
        >
          <div className="text-[10px] sm:text-xs font-medium text-white truncate">
            {displayName}
          </div>
        </div>
      </div>

      {/* Hover tooltip with full info */}
      {isHovered && (
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bottom-full mb-2",
            "bg-panel/95 backdrop-blur-md border border-border rounded-lg",
            "px-3 py-2 shadow-xl z-30 whitespace-nowrap",
            "animate-fade-in"
          )}
        >
          <div className="text-sm font-semibold text-white">{player.name}</div>
          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
            {player.number && <span>#{player.number}</span>}
            <span>{player.position}</span>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border" />
        </div>
      )}
    </div>
  );
}

// Placeholder player card for when lineups aren't available
export function PlaceholderPlayerCard({
  position,
  label,
}: {
  position: { x: number; y: number };
  label: string;
}) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 border-dashed flex items-center justify-center">
        <span className="text-xs text-muted/50">{label}</span>
      </div>
    </div>
  );
}
