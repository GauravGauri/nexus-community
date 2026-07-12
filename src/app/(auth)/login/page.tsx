"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { KeyRound, Mail, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((state) => state.login);
  const [activeTab, setActiveTab] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Username is required");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      const success = login(username);
      setLoading(false);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid username. Try using a preset demo account.");
      }
    }, 800);
  };

  const handlePresetSelect = (presetUser: string) => {
    setUsername(presetUser);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Sign In to Nexus</h2>
        <p className="text-xs text-zinc-400">Select a preset demo account or enter your credentials.</p>
      </div>

      <Tabs
        tabs={[
          { id: "student", label: "Student ID" },
          { id: "professional", label: "Professional SSO" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={activeTab === "student" ? "Student Username" : "Corporate Username"}
          placeholder="e.g. leosterling"
          leftIcon={<UserIcon className="h-4.5 w-4.5" />}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={error}
          disabled={loading}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<KeyRound className="h-4.5 w-4.5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-1.5 text-zinc-400 select-none">
            <input type="checkbox" className="rounded-md border-white/10 bg-white/5 checked:bg-primary accent-primary" />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-violet-400 hover:text-violet-300 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button variant="primary" className="w-full" type="submit" loading={loading}>
          Sign In
        </Button>
      </form>

      {/* Preset Demo Accounts */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-center">
          Quick Demo Accounts (No password required)
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handlePresetSelect("leosterling")}
            className="p-2 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 transition-colors"
          >
            <p className="font-semibold text-white">Student Leo</p>
            <p className="text-[10px] text-zinc-400">CS Senior, Verified</p>
          </button>
          <button
            onClick={() => handlePresetSelect("sarahjenkins")}
            className="p-2 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 transition-colors"
          >
            <p className="font-semibold text-white">Admin Sarah</p>
            <p className="text-[10px] text-zinc-400">Campus Director</p>
          </button>
          <button
            onClick={() => handlePresetSelect("alexrivera")}
            className="p-2 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 transition-colors"
          >
            <p className="font-semibold text-white">Moderator Alex</p>
            <p className="text-[10px] text-zinc-400">Engineering Lead</p>
          </button>
          <button
            onClick={() => handlePresetSelect("liamcarter")}
            className="p-2 text-left rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300 transition-colors"
          >
            <p className="font-semibold text-white">Guest Liam</p>
            <p className="text-[10px] text-zinc-400">Freshman, Unverified</p>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium">
          Create account
        </Link>
      </div>
    </div>
  );
}
