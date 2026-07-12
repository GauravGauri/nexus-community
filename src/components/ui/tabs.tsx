"use client";

import React from "react";
import { motion } from "framer-motion";

interface TabItem {
  id: string;
  label: string | React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "pill" | "line";
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "pill",
}: TabsProps) {
  return (
    <div
      className={`flex select-none ${
        variant === "pill"
          ? "p-1 rounded-xl bg-secondary/85 border border-border/30"
          : "border-b border-border/40"
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center justify-center flex-1 px-4 py-2 text-sm font-semibold transition-colors duration-250 focus:outline-hidden cursor-pointer z-10 ${
              isActive
                ? variant === "pill"
                  ? "text-primary-foreground"
                  : "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && variant === "pill" && (
              <motion.div
                layoutId="active-tab-pill"
                className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            
            {isActive && variant === "line" && (
              <motion.div
                layoutId="active-tab-line"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
