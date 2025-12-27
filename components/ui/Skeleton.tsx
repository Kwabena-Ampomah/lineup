"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton rounded-lg bg-white/[0.04]",
        className
      )}
    />
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-32 h-5" />
        </div>
        <Skeleton className="w-8 h-6" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-28 h-5" />
        </div>
        <Skeleton className="w-8 h-6" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
    </div>
  );
}

export function MatchDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-xl border border-border bg-white/[0.02] p-6">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <Skeleton className="w-24 h-5" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-24 h-10" />
            <Skeleton className="w-12 h-4" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <Skeleton className="w-24 h-10 rounded-lg" />
        <Skeleton className="w-24 h-10 rounded-lg" />
        <Skeleton className="w-24 h-10 rounded-lg" />
      </div>

      {/* Content skeleton */}
      <div className="rounded-xl border border-border bg-white/[0.02] p-6">
        <div className="aspect-[2/3] max-w-md mx-auto">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PitchSkeleton() {
  return (
    <div className="relative w-full aspect-[2/3] rounded-2xl bg-gradient-to-b from-pitch-light to-pitch-dark border border-white/10 overflow-hidden">
      <div className="absolute inset-[8%] border border-white/20 rounded-lg" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/20 rounded-full" />

      {/* Player placeholders */}
      {[...Array(11)].map((_, i) => (
        <div
          key={i}
          className="absolute skeleton w-16 h-20 rounded-lg"
          style={{
            left: `${15 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 25}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="relative w-16 flex flex-col items-center">
      <Skeleton className="w-14 h-14 rounded-full" />
      <Skeleton className="w-12 h-4 mt-1" />
      <Skeleton className="w-8 h-3 mt-0.5" />
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-24 h-3" />
      </div>
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  );
}

export function StatRowSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-5" />
      <div className="flex-1 h-2 rounded-full bg-white/[0.04]">
        <Skeleton className="h-full w-1/2 rounded-full" />
      </div>
      <Skeleton className="w-24 h-4" />
      <div className="flex-1 h-2 rounded-full bg-white/[0.04]">
        <Skeleton className="h-full w-1/3 rounded-full" />
      </div>
      <Skeleton className="w-12 h-5" />
    </div>
  );
}
