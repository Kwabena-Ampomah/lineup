"use client";

import { useMemo } from "react";
import { PlayerCard, PlaceholderPlayerCard } from "./PlayerCard";
import {
  getFormationTemplate,
  buildFallbackTemplate,
  type FormationSlot,
} from "./formationTemplates";
import { mapPositionToSlots } from "./positionMapper";
import { cn } from "@/lib/utils";
import type { Player, TeamLineup } from "@/lib/types";

interface PitchProps {
  lineup: TeamLineup;
  side?: "home" | "away";
  className?: string;
}

interface PositionedPlayer extends Player {
  pitchX: number;
  pitchY: number;
  isGoalkeeper: boolean;
}

function positionPlayersOnPitch(
  players: Player[],
  formation: string | null
): PositionedPlayer[] {
  const template = formation
    ? getFormationTemplate(formation)
    : buildFallbackTemplate(players.length);

  const positionedPlayers: PositionedPlayer[] = [];
  const usedSlots = new Set<number>();
  const usedPlayers = new Set<number>();

  // First pass: match players to slots by position
  players.forEach((player) => {
    if (usedPlayers.has(player.id)) return;

    const candidates = mapPositionToSlots(player.position);
    if (!candidates.length) return;

    // Find a matching slot that hasn't been used
    const slotIndex = template.findIndex(
      (slot, idx) => !usedSlots.has(idx) && candidates.includes(slot.slot)
    );

    if (slotIndex !== -1) {
      const slot = template[slotIndex];
      positionedPlayers.push({
        ...player,
        pitchX: slot.x,
        pitchY: slot.y,
        isGoalkeeper: slot.slot === "GK" || player.position.toUpperCase() === "G",
      });
      usedSlots.add(slotIndex);
      usedPlayers.add(player.id);
    }
  });

  // Second pass: fill remaining slots with unplaced players
  players.forEach((player) => {
    if (usedPlayers.has(player.id)) return;

    // Find first unused slot
    const slotIndex = template.findIndex((_, idx) => !usedSlots.has(idx));
    if (slotIndex !== -1) {
      const slot = template[slotIndex];
      positionedPlayers.push({
        ...player,
        pitchX: slot.x,
        pitchY: slot.y,
        isGoalkeeper: slot.slot === "GK",
      });
      usedSlots.add(slotIndex);
      usedPlayers.add(player.id);
    }
  });

  return positionedPlayers;
}

export function Pitch({ lineup, side = "home", className }: PitchProps) {
  const primaryColor = lineup.colors?.player?.primary
    ? `#${lineup.colors.player.primary}`
    : "#4ade80";

  const positionedPlayers = useMemo(
    () => positionPlayersOnPitch(lineup.startingXI, lineup.formation),
    [lineup.startingXI, lineup.formation]
  );

  const hasPlayers = positionedPlayers.length > 0;

  return (
    <div className={cn("relative", className)}>
      {/* Pitch */}
      <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-b from-pitch-light to-pitch-dark border border-white/10 shadow-2xl">
        {/* Field markings */}
        <div className="absolute inset-[6%] border border-white/25 rounded-lg pointer-events-none" />

        {/* Center line */}
        <div className="absolute top-1/2 left-[6%] right-[6%] h-px bg-white/25" />

        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square border border-white/25 rounded-full" />

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />

        {/* Penalty areas */}
        <div className="absolute top-[6%] left-[22%] right-[22%] h-[12%] border-x border-b border-white/25 rounded-b-lg" />
        <div className="absolute bottom-[6%] left-[22%] right-[22%] h-[12%] border-x border-t border-white/25 rounded-t-lg" />

        {/* Goal areas */}
        <div className="absolute top-[6%] left-[32%] right-[32%] h-[5%] border-x border-b border-white/20 rounded-b" />
        <div className="absolute bottom-[6%] left-[32%] right-[32%] h-[5%] border-x border-t border-white/20 rounded-t" />

        {/* Players */}
        {hasPlayers ? (
          positionedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              position={{ x: player.pitchX, y: player.pitchY }}
              color={primaryColor}
              isGoalkeeper={player.isGoalkeeper}
            />
          ))
        ) : (
          // Placeholder formation when no lineup available
          buildFallbackTemplate(11).map((slot, idx) => (
            <PlaceholderPlayerCard
              key={idx}
              position={{ x: slot.x, y: slot.y }}
              label={slot.slot}
            />
          ))
        )}

        {/* Team badge overlay */}
        <div
          className={cn(
            "absolute top-3 px-3 py-1.5 rounded-lg",
            "bg-black/50 backdrop-blur-sm border border-white/10",
            "flex items-center gap-2",
            side === "home" ? "left-3" : "right-3"
          )}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="text-xs font-medium text-white truncate max-w-[100px]">
            {lineup.team.name}
          </span>
          {lineup.formation && (
            <span className="text-xs text-muted">{lineup.formation}</span>
          )}
        </div>

        {/* No lineup message overlay */}
        {!hasPlayers && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <div className="bg-panel/90 border border-border rounded-lg px-4 py-3 text-center">
              <p className="text-sm text-muted">
                Lineups not available for this match
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Coach info */}
      {lineup.coach && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Coach: {lineup.coach.name}</span>
        </div>
      )}
    </div>
  );
}

// Empty pitch placeholder
export function EmptyPitch({ message }: { message?: string }) {
  return (
    <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-b from-pitch-light to-pitch-dark border border-white/10">
      <div className="absolute inset-[6%] border border-white/20 rounded-lg border-dashed" />
      <div className="absolute top-1/2 left-[6%] right-[6%] h-px bg-white/20 border-dashed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square border border-white/20 rounded-full border-dashed" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-muted/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-muted">
            {message || "Lineups not available for this match"}
          </p>
        </div>
      </div>
    </div>
  );
}
