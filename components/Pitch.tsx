"use client";

import { useMemo, useState } from "react";
import {
  buildFallbackTemplate,
  formationTemplates,
  normalizeFormation,
  type FormationSlot,
} from "./formationTemplates";
import { mapPositionToSlots } from "./positionMapper";

export type PitchPlayer = {
  id: number | string;
  name: string;
  number?: number;
  position?: string;
};

type PositionedPlayer = PitchPlayer & FormationSlot;

type PitchProps = {
  teamName: string;
  formation?: string;
  players: PitchPlayer[];
  color?: string;
};

const positionPlayers = (
  players: PitchPlayer[],
  formation?: string,
): PositionedPlayer[] => {
  const normalizedFormation = normalizeFormation(formation);
  const template =
    normalizedFormation && formationTemplates[normalizedFormation]
      ? [...formationTemplates[normalizedFormation]]
      : null;

  if (!template) {
    const grid = buildFallbackTemplate(players.length);
    return players.slice(0, grid.length).map((player, idx) => ({
      ...player,
      ...grid[idx],
    }));
  }

  const placements: PositionedPlayer[] = [];
  const usedPlayers = new Set<number | string>();

  // First pass: place players into matching slots.
  players.forEach((player) => {
    const candidates = mapPositionToSlots(player.position);
    if (!candidates.length) return;
    const slotIndex = template.findIndex((slot) =>
      candidates.includes(slot.slot),
    );
    if (slotIndex !== -1) {
      const slot = template.splice(slotIndex, 1)[0];
      placements.push({ ...player, ...slot });
      usedPlayers.add(player.id);
    }
  });

  // Second pass: fill remaining template slots in order.
  players.forEach((player) => {
    if (usedPlayers.has(player.id)) return;
    const slot = template.shift();
    if (!slot) return;
    placements.push({ ...player, ...slot });
    usedPlayers.add(player.id);
  });

  // If somehow fewer players placed than available, fall back to grid for consistency.
  if (placements.length < players.length) {
    const grid = buildFallbackTemplate(players.length);
    return players.slice(0, grid.length).map((player, idx) => ({
      ...player,
      ...grid[idx],
    }));
  }

  return placements;
};

export function Pitch({ teamName, formation, players, color }: PitchProps) {
  const [focusedId, setFocusedId] = useState<number | string | null>(null);

  const positionedPlayers = useMemo(
    () => positionPlayers(players, formation),
    [players, formation],
  );

  return (
    <div className="pitch">
      <div className="half-line" />
      <div className="center-circle" />
      <div className="penalty-box penalty-top" />
      <div className="penalty-box penalty-bottom" />

      {positionedPlayers.map((player, idx) => {
        const key = player.id ?? `${player.name}-${idx}`;
        const showTooltip = focusedId === key;
        return (
          <div
            key={key}
            className="player-node"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
          >
            <button
              className="player-badge"
              style={{
                borderColor: color
                  ? `${color}55`
                  : "rgba(255,255,255,0.12)",
              }}
              onClick={() => setFocusedId(showTooltip ? null : key)}
            >
              <span style={{ display: "block" }}>{player.name}</span>
              <small>{player.position || player.slot || "?"}</small>
            </button>
            {showTooltip && (
              <div className="tooltip">
                <div style={{ fontWeight: 700 }}>{player.name}</div>
                <div style={{ color: "#94a3b8" }}>
                  {player.position || player.slot || "Position"}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          padding: "6px 10px",
          borderRadius: 10,
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontSize: 12,
          color: "#e2e8f0",
          display: "inline-flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color || "#4ade80",
          }}
        />
        {teamName}
        {formation && <span style={{ color: "#94a3b8" }}>{formation}</span>}
      </div>
    </div>
  );
}
