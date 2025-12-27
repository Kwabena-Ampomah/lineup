"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { Team } from "@/lib/types";

type TeamResponse = {
  response: { team: Team }[];
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Unable to search teams");
      const data: TeamResponse = await res.json();
      setResults(data.response.map((item) => item.team));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="stack" style={{ gap: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 6px 0" }}>Find a club</h1>
          <p style={{ margin: 0, color: "#94a3b8" }}>
            Search by team name and open a fixture to view the latest lineup
            drawn on the pitch.
          </p>
        </div>
        <form onSubmit={handleSearch} className="row">
          <input
            className="input"
            placeholder="e.g. Barcelona, Arsenal, Napoli"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && (
          <div className="card" style={{ borderColor: "rgba(248,113,113,0.45)" }}>
            {error}
          </div>
        )}
        <div className="stack">
          {loading && results.length === 0 && (
            <div className="card">Loading teams...</div>
          )}
          {!loading && results.length === 0 && !error && (
            <div className="card" style={{ color: "#94a3b8" }}>
              No teams yet. Start by searching.
            </div>
          )}
          {results.map((team) => (
            <Link key={team.id} href={`/team/${team.id}`} className="card">
              <div
                className="row"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.06)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "#e2e8f0",
                      fontSize: 18,
                    }}
                  >
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>
                      {team.name}
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>
                      {team.country || "Unknown country"}
                    </div>
                  </div>
                </div>
                <div className="badge">View fixtures</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
