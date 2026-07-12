"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/55 focus:border-ring/30 ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${
              error
                ? "border-destructive/80 focus:ring-destructive/40"
                : "border-border/60 dark:border-border/30"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground/60 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/55 focus:border-ring/30 min-h-24 ${
            error
              ? "border-destructive/80 focus:ring-destructive/40"
              : "border-border/60 dark:border-border/30"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
