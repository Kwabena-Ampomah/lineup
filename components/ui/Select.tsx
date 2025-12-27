"use client";

import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  disabled = false,
}: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "appearance-none w-full bg-white/[0.04] border border-border rounded-lg",
          "px-4 py-2.5 pr-10 text-sm text-slate-200",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors cursor-pointer",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-panel">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  className?: string;
}

export function Toggle({ enabled, onChange, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium",
        "transition-all duration-200",
        enabled
          ? "bg-accent/20 border-accent/50 text-accent"
          : "bg-white/[0.04] border-border text-muted hover:text-slate-200 hover:border-border",
        className
      )}
    >
      <span
        className={cn(
          "w-4 h-4 rounded-full border-2 transition-colors",
          enabled
            ? "bg-accent border-accent"
            : "bg-transparent border-muted"
        )}
      >
        {enabled && (
          <svg
            className="w-full h-full text-bg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
