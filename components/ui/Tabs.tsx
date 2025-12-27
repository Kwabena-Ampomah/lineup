"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const updateIndicator = () => {
      if (!tabsRef.current) return;

      const activeButton = tabsRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      ) as HTMLButtonElement;

      if (activeButton) {
        setIndicatorStyle({
          width: activeButton.offsetWidth,
          transform: `translateX(${activeButton.offsetLeft}px)`,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={tabsRef}
        className="flex gap-1 p-1 bg-white/[0.02] rounded-lg border border-border overflow-x-auto no-scrollbar"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md",
              "transition-all duration-200 whitespace-nowrap",
              "focus:outline-none focus:ring-2 focus:ring-accent/50",
              activeTab === tab.id
                ? "text-accent"
                : "text-muted hover:text-slate-200"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        {/* Active indicator */}
        <div
          className="absolute bottom-1 h-0.5 bg-gradient-to-r from-accent to-green-500 rounded-full transition-all duration-300"
          style={indicatorStyle}
        />
      </div>
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className }: TabPanelProps) {
  if (id !== activeTab) return null;

  return (
    <div
      role="tabpanel"
      aria-labelledby={id}
      className={cn("animate-fade-in", className)}
    >
      {children}
    </div>
  );
}
