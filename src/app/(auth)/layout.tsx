"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#070709] overflow-hidden px-4 py-12">
      {/* Background Decorative Grids and Light Rings */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Glowing ambient blobs */}
      <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center space-y-6 relative z-10">
        {/* Brand Logo Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-2"
        >
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-white group">
            <div className="p-2 rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span>Nexus <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Community</span></span>
          </Link>
          <p className="text-sm text-zinc-400 font-medium">Verify. Connect. Collaborate.</p>
        </motion.div>

        {/* Central Auth Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full rounded-3xl border border-white/5 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl glass"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
