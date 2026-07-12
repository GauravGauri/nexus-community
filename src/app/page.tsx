"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Building,
  Users,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  // Interactive preview widget states
  const [previewVotes, setPreviewVotes] = useState([12, 4, 2]);
  const [hasVoted, setHasVoted] = useState<number | null>(null);
  const [likes, setLikes] = useState(24);
  const [liked, setLiked] = useState(false);

  // GSAP animation for floating background blobs and headings
  useEffect(() => {
    // Blobs floating animations
    if (blob1Ref.current && blob2Ref.current) {
      gsap.to(blob1Ref.current, {
        x: "30%",
        y: "20%",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(blob2Ref.current, {
        x: "-30%",
        y: "-20%",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Hero entrance animations
    const ctx = gsap.context(() => {
      gsap.from(".animate-hero-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
      gsap.from(".animate-hero-widget", {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handlePreviewVote = (index: number) => {
    if (hasVoted !== null) return;
    setHasVoted(index);
    setPreviewVotes((prev) => {
      const copy = [...prev];
      copy[index] += 1;
      return copy;
    });
  };

  const handlePreviewLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const totalPreviewVotes = previewVotes.reduce((s, v) => s + v, 0);

  return (
    <div ref={heroRef} className="relative min-h-screen bg-[#070709] text-white overflow-hidden flex flex-col font-sans">
      
      {/* 1. BACKGROUND GRID AND FLOATING BLOBS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Glowing mesh blobs */}
      <div
        ref={blob1Ref}
        className="absolute top-[10%] -left-[10%] w-[45%] h-[45%] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none"
      />
      <div
        ref={blob2Ref}
        className="absolute bottom-[10%] -right-[10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none"
      />

      {/* 2. LANDING NAVBAR */}
      <header className="relative z-10 w-full max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 font-bold tracking-tight text-white group">
          <div className="p-1.5 rounded-lg bg-linear-to-r from-violet-500 to-indigo-500 text-white shadow-xs group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <span className="text-lg">Nexus <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent font-black">Community</span></span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-xs text-zinc-400 hover:text-white font-bold transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm" className="rounded-xl shadow-md shadow-primary/10">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* 3. HERO HERO CONTENT AREA */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 md:py-20">
        
        {/* Left Column Text */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-4">
            <span className="animate-hero-text inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold border border-violet-500/20 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen campus workspace
            </span>
            
            <h1 className="animate-hero-text text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white">
              The Workspace for Verified{" "}
              <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Organizations.
              </span>
            </h1>
            
            <p className="animate-hero-text text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
              Verify your university email, college card or employee credentials. Join private discussion hubs, chat boards, calendar schedules, and interactive Q&A networks.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-hero-text flex items-center gap-3 pt-2">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="rounded-xl shadow-lg hover:shadow-primary/20">
                Join Workspace
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="glass" size="lg" className="rounded-xl border-white/5 bg-white/[0.02]">
                Explore Preset Demos
              </Button>
            </Link>
          </div>

          {/* Mini Features */}
          <div className="animate-hero-text grid grid-cols-3 gap-4 pt-6 border-t border-white/5 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
            <div className="space-y-1">
              <p className="text-white font-bold text-sm">100%</p>
              <p>Verified Profiles</p>
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold text-sm">20+</p>
              <p>Functional Modules</p>
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold text-sm">60fps</p>
              <p>Lenis Scrolling</p>
            </div>
          </div>
        </div>

        {/* Right Column Dashboard Widget Preview */}
        <div className="lg:col-span-6 animate-hero-widget flex justify-center">
          <div className="relative w-full max-w-md">
            
            {/* Ambient glowing ring behind card */}
            <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 blur-[80px] opacity-25 rounded-3xl" />

            {/* Dashboard Card Shell */}
            <div className="relative w-full bg-zinc-900/65 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl space-y-5 glass">
              
              {/* Header preview */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-zinc-400">
                <span className="font-bold flex items-center gap-1">
                  <Building className="h-4 w-4 text-violet-400" /> Nexus University Hub
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-black border border-emerald-500/20">
                  SECURE PREVIEW
                </span>
              </div>

              {/* Feed Post snippet preview */}
              <div className="space-y-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80?h=80"
                    alt=""
                    className="w-5.5 h-5.5 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-[10px] font-bold text-white flex items-center gap-0.5">
                      Elena Vance <span className="text-emerald-400 text-[9px]">🛡️</span>
                    </p>
                    <p className="text-[8px] text-zinc-500">UI Designer @ Vercel</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-300 leading-normal">
                  Testing Tailwind CSS v4 in my dashboard. The CSS `@theme` variables are so clean!
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handlePreviewLike}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                      liked ? "bg-rose-500/10 border-rose-500/35 text-rose-400" : "border-white/5 bg-white/[0.01] text-zinc-500"
                    }`}
                  >
                    <Flame className="h-3 w-3" /> {likes}
                  </button>
                  <span className="text-[9px] text-zinc-500">🔥 Click to react</span>
                </div>
              </div>

              {/* Interactive Poll widget preview */}
              <div className="space-y-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs">
                <h4 className="font-extrabold text-[11px] text-white">Preferred State Management?</h4>
                <div className="space-y-2">
                  {["Zustand", "Redux Toolkit", "Context API"].map((opt, idx) => {
                    const votes = previewVotes[idx];
                    const pct = totalPreviewVotes > 0 ? Math.round((votes / totalPreviewVotes) * 100) : 0;
                    const selected = hasVoted === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePreviewVote(idx)}
                        disabled={hasVoted !== null}
                        className={`w-full p-2 text-left rounded-xl border text-[10px] font-semibold relative overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          selected
                            ? "border-primary/40 text-primary bg-primary/5"
                            : "border-white/5 bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div
                          className="absolute top-0 bottom-0 left-0 bg-primary/10 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                        <span className="relative z-10 truncate max-w-[70%]">{opt}</span>
                        <span className="relative z-10 font-bold">{pct}%</span>
                      </button>
                    );
                  })}
                </div>
                {hasVoted === null && (
                  <p className="text-[8px] text-zinc-500 text-center font-bold">⚡ Click option above to cast vote</p>
                )}
              </div>

            </div>

          </div>
        </div>

      </main>

      {/* 4. LANDING FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-500 relative z-10">
        <p>© 2026 Nexus Community Inc. Designed with React 19, Next.js 15, Tailwind v4 and Lenis scrolling.</p>
      </footer>

    </div>
  );
}
