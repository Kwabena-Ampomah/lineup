"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Fixture } from "@/lib/types";

type FixtureResponse = {
  response: Fixture[];
};

const extractApiError = (data: any) => {
  if (!data) return null;
  if (data.error) return data.error;
  if (data.errors) {
    if (Array.isArray(data.errors) && data.errors.length) {
      return data.errors.join(", ");
    }
    if (typeof data.errors === "object") {
      const values = Object.values(data.errors);
      if (values.length) return String(values[0]);
    }
  }
  return null;
};

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TeamPage() {
  const params = useParams<{ teamId: string }>();
  const teamId = params?.teamId;
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!teamId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/fixtures?team=${teamId}&last=10`);
        const data: FixtureResponse & { error?: string; errors?: any } =
          await res.json();
        if (!res.ok) {
          const apiError = extractApiError(data);
          throw new Error(apiError || "Unable to load fixtures");
        }
        setFixtures(data.response ?? []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [teamId]);

  const teamName = useMemo(() => {
    if (fixtures[0]) {
      const homeMatch = fixtures[0];
      if (homeMatch.teams.home.id === Number(teamId)) {
        return homeMatch.teams.home.name;
      }
      return homeMatch.teams.away.name;
    }
    return `Team ${teamId}`;
  }, [fixtures, teamId]);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" className="badge">
            ← Back
          </Link>
          <h1 style={{ margin: 0 }}>
            Last fixtures • <span style={{ color: "#4ade80" }}>{teamName}</span>
          </h1>
        </div>
        <div className="badge">Last 10</div>
      </div>
      <div className="panel stack">
        {loading && <div className="card">Loading fixtures...</div>}
        {error && (
          <div className="card" style={{ borderColor: "rgba(248,113,113,0.45)" }}>
            {error}
          </div>
        )}
        {!loading && !error && fixtures.length === 0 && (
          <div className="card" style={{ color: "#94a3b8" }}>
            No fixtures available (check season/plan or try another team).
          </div>
        )}
        {!loading &&
          fixtures.map((fixture) => {
            const isHome = fixture.teams.home.id === Number(teamId);
            const opponent = isHome ? fixture.teams.away : fixture.teams.home;
            const scoreHome = fixture.goals.home ?? "-";
            const scoreAway = fixture.goals.away ?? "-";
            const score = `${scoreHome} : ${scoreAway}`;
            return (
              <Link
                key={fixture.fixture.id}
                href={`/match/${fixture.fixture.id}`}
                className="card"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <div className="badge">{formatDate(fixture.fixture.date)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      vs {opponent.name}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>
                      {fixture.fixture.venue?.name || "Unknown venue"}
                    </div>
                  </div>
                </div>
                <div
                  className="badge"
                  style={{
                    background: "rgba(74,222,128,0.1)",
                    borderColor: "rgba(74,222,128,0.35)",
                  }}
                >
                  {score}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
