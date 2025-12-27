import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const font = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "LineupPitch - Football Match Lineups",
  description: "View football match lineups, formations, and live scores with beautiful pitch visualizations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.variable}>
      <body className={font.className}>
        <div className="min-h-screen">
          {/* Navigation */}
          <nav className="sticky top-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-border/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link
                  href="/"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-green-600 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-bg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-bold tracking-tight group-hover:text-accent transition-colors">
                    LineupPitch
                  </span>
                </Link>

                <div className="flex items-center gap-4">
                  <span className="text-xs px-2.5 py-1 rounded-full border border-border bg-white/[0.02] text-muted">
                    API-Football v3
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/50 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
                <p>Data provided by API-Football (API-Sports)</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.api-football.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    API Docs
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
