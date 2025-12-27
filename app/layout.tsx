import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const font = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LineupPitch",
  description: "Visualize soccer lineups in a formation-first view.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <main className="shell">
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: 12,
            }}
          >
            <Link href="/" style={{ display: "inline-flex", gap: 10 }}>
              <span
                style={{
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontSize: 22,
                }}
              >
                LineupPitch
              </span>
              <span className="badge">App Router</span>
            </Link>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>
              Recent lineups, drawn on the pitch.
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
