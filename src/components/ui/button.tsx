"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "glass";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Styles mapping matching Tailwind v4 variables
  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-linear-to-r from-primary to-indigo-600 text-primary-foreground hover:shadow-lg hover:shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-muted-foreground/10 border border-border/40",
    outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-muted-foreground/20",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
    destructive: "bg-destructive text-destructive-foreground hover:bg-red-600",
    glass: "glass text-foreground hover:bg-white/20 dark:hover:bg-zinc-800/60 border border-white/20 dark:border-zinc-850/60 shadow-xs",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold gap-1",
    md: "px-4.5 py-2 text-sm font-semibold gap-1.5",
    lg: "px-6 py-3 text-base font-semibold gap-2",
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015, y: -0.5 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985, y: 0 } : {}}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as any)}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
