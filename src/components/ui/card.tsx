"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered";
  hoverEffect?: boolean;
}

export function Card({
  children,
  variant = "default",
  hoverEffect = false,
  className = "",
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl border transition-all duration-300";
  
  const variants = {
    default: "bg-card text-card-foreground border-border/50 shadow-xs",
    glass: "glass shadow-sm",
    bordered: "bg-transparent text-foreground border-border/80",
  };

  const Component = hoverEffect ? motion.div : "div";
  const hoverProps = hoverEffect
    ? {
        whileHover: { y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${
        hoverEffect ? "hover:border-primary/45 dark:hover:border-ring/45" : ""
      } ${className}`}
      {...(props as any)}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-bold tracking-tight text-foreground ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 pt-0 flex items-center border-t border-border/20 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
