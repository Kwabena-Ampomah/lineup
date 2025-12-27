"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pitch } from "@/components/Pitch";
import type { Lineup, LineupPlayer } from "@/lib/types";

type LineupResponse = {
  response: Lineup[];
};

const toPitchPlayers = (players: { player: LineupPlayer }[]) =>
  (players || []).slice(0, 11).map((entry) => ({
    id: entry.player.id ?? `${entry.player.name}-${entry.player.number ?? ""}`,
    name: entry.player.name,
    position:
      entry.player.position ??
      entry.player.pos ??
      entry.player.grid ??
      undefined,
    number: entry.player.number,
  }));

export default function MatchPage() {
  const params = useParams<{ fixtureId: string }>();
  const fixtureId = params?.fixtureId;

  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!fixtureId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/lineups?fixture=${fixtureId}`);
        if (!res.ok) throw new Error("Unable to load lineups");
        const data: LineupResponse = await res.json();
        setLineups(data.response || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fixtureId]);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/" className="badge">
            ← Home
          </Link>
          {lineups[0]?.team.id && (
            <Link href={`/team/${lineups[0]?.team.id}`} className="badge">
              ← Team
            </Link>
          )}
          <h1 style={{ margin: 0 }}>
            Fixture #{fixtureId} lineups
          </h1>
        </div>
      </div>
      <div className="stack">
        {loading && <div className="panel">Loading lineups...</div>}
        {error && (
          <div className="panel" style={{ borderColor: "rgba(248,113,113,0.45)" }}>
            {error}
          </div>
        )}
        {!loading && !error && lineups.length === 0 && (
          <div className="panel">Lineup not available.</div>
        )}
        {!loading &&
          !error &&
          lineups.map((lineup, idx) => {
            const players = toPitchPlayers(lineup.startXI);
            const color = lineup.team.colors?.player?.primary;
            return (
              <div
                key={`${lineup.team.id}-${idx}`}
                className="panel stack"
                style={{ gap: 12 }}
              >
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>
                      {lineup.team.name}
                    </div>
                    <div style={{ color: "#94a3b8" }}>
                      Formation {lineup.formation || "Unknown"}
                    </div>
                  </div>
                  <div className="badge">
                    {players.length ? `${players.length} players` : "No lineup"}
                  </div>
                </div>
                {players.length ? (
                  <Pitch
                    teamName={lineup.team.name}
                    formation={lineup.formation}
                    players={players}
                    color={color}
                  />
                ) : (
                  <div className="card">Lineup not available.</div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
