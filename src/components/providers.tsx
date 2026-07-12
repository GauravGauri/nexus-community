"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Lenis from "lenis";

// Custom Lenis Wrapper to avoid React 19 compatibility issues with older wrappers
function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only instantiate on client
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a QueryClient instance on client side to avoid sharing cache across users/requests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return children directly during SSR to avoid mismatch hydration issues
    return (
      <QueryClientProvider client={queryClient}>
        <div style={{ visibility: "hidden" }}>{children}</div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        disableTransitionOnChange
      >
        <LenisProvider>{children}</LenisProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
