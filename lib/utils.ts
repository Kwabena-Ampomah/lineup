import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays === -1) {
    return "Tomorrow";
  } else if (diffDays > 0 && diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 0 && diffDays > -7) {
    return `In ${Math.abs(diffDays)} days`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("live") || statusLower === "1h" || statusLower === "2h" || statusLower === "ht") {
    return "text-green-400";
  }
  if (statusLower === "ft" || statusLower === "aet" || statusLower === "pen") {
    return "text-muted";
  }
  if (statusLower === "ns" || statusLower === "tbd") {
    return "text-blue-400";
  }
  if (statusLower === "pst" || statusLower === "canc" || statusLower === "susp") {
    return "text-red-400";
  }
  return "text-muted";
}

export function getStatusBadgeClass(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("live") || statusLower === "1h" || statusLower === "2h" || statusLower === "ht") {
    return "bg-green-500/20 text-green-400 border-green-500/30";
  }
  if (statusLower === "ft" || statusLower === "aet" || statusLower === "pen") {
    return "bg-white/5 text-muted border-border";
  }
  if (statusLower === "ns" || statusLower === "tbd") {
    return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
  if (statusLower === "pst" || statusLower === "canc" || statusLower === "susp") {
    return "bg-red-500/20 text-red-400 border-red-500/30";
  }
  return "bg-white/5 text-muted border-border";
}

export function truncateName(name: string, maxLength: number = 12): string {
  if (name.length <= maxLength) return name;

  // Try to truncate at a space if possible
  const parts = name.split(" ");
  if (parts.length > 1) {
    // Use last name if it fits
    const lastName = parts[parts.length - 1];
    if (lastName.length <= maxLength) {
      return lastName;
    }
    // Use first initial + last name
    const abbreviated = `${parts[0][0]}. ${lastName}`;
    if (abbreviated.length <= maxLength) {
      return abbreviated;
    }
  }

  return name.slice(0, maxLength - 1) + "…";
}

export function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function parseFormation(formation: string | null): number[] {
  if (!formation) return [4, 4, 2]; // Default formation

  const parts = formation.split("-").map((p) => parseInt(p, 10));
  return parts.filter((p) => !isNaN(p));
}

export function getSeasonOptions(): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = currentMonth >= 7 ? currentYear : currentYear - 1;

  const seasons = [];
  for (let year = currentSeason; year >= currentSeason - 4; year--) {
    seasons.push({
      value: String(year),
      label: `${year}/${String(year + 1).slice(-2)}`,
    });
  }
  return seasons;
}
