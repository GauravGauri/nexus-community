"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: DialogProps) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full ${sizes[size]} overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-2xl z-10 glass`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 p-5">
              <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="!p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/10 border-0"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Inner Content */}
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Custom slide-up Drawer for notification centers, user profiles, or actions
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md h-full border-l border-border/50 bg-card text-card-foreground shadow-2xl z-10 flex flex-col glass"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/20">
              <h3 className="text-lg font-bold tracking-tight text-foreground">{title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="!p-1 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
