"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Megaphone,
  CheckCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { currentUser, users, communities, events, announcements, polls, jobs, resources } = useStore();

  // Onboarding Personalization Logic
  const deptKeyword = currentUser?.department?.toLowerCase().split(" ")[0] || "";
  const userInterests = currentUser?.interests || [];

  // 1. Recommended Communities
  const recommendedComms = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(deptKeyword) ||
      c.description.toLowerCase().includes(deptKeyword) ||
      c.members.includes(currentUser?.id || "")
  ).slice(0, 3);

  // 2. Recommended Jobs
  const recommendedJobs = jobs.filter(
    (j) =>
      j.tags.some((t) => userInterests.includes(t)) ||
      j.title.toLowerCase().includes(deptKeyword)
  ).slice(0, 2);

  // 3. Recommended Resources
  const recommendedResources = resources.filter(
    (r) =>
      r.department === currentUser?.department ||
      r.tags.some((t) => userInterests.includes(t))
  ).slice(0, 2);

  // 4. Suggested Connections (Same department peers)
  const suggestedPeers = users
    .filter((u) => u.id !== currentUser?.id && u.department === currentUser?.department)
    .slice(0, 3);

  // Sort users by reputation for Leaderboard widget
  const leaderboardUsers = [...users].sort((a, b) => b.reputation - a.reputation).slice(0, 4);

  // Upcoming events limit 2
  const upcomingEvents = events.slice(0, 2);

  // Pinned announcement
  const pinnedAnn = announcements.find((a) => a.pinned) || announcements[0];

  // CommunitiesJoined count
  const joinedCommCount = communities.filter((c) => c.members.includes(currentUser?.id || "")).length;

  const [activeRecTab, setActiveRecTab] = React.useState<"spaces" | "careers" | "files">("spaces");

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/10 bg-linear-to-r from-violet-500/10 to-indigo-500/10 p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 p-8 text-primary/10 pointer-events-none">
          <Sparkles className="h-24 w-24" />
        </div>
        <div className="max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            ✨ {currentUser?.department || "NEXUS"} Workspace
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{currentUser?.name}</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Manage your network, collaborate with campus communities, browse active Q&A forums, and review notifications below.
          </p>
        </div>
      </motion.div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hoverEffect>
          <CardContent className="pt-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Joined Spaces</p>
              <p className="text-xl font-black">{joinedCommCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="pt-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Reputation Score</p>
              <p className="text-xl font-black">{currentUser?.reputation}</p>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="pt-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Registered Events</p>
              <p className="text-xl font-black">
                {events.filter((e) => e.registeredUsers.includes(currentUser?.id || "")).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardContent className="pt-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Active Polls</p>
              <p className="text-xl font-black">{polls.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main dashboard widgets columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Quick Actions, Spotlights, Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick actions panel */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/10">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
                Quick Action Launcher
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/feed?action=new-post">
                  <Button variant="outline" className="w-full h-20 rounded-2xl flex flex-col items-center justify-center gap-1 bg-white/[0.01]">
                    <Plus className="h-5 w-5 text-violet-400" />
                    <span className="text-xs">Write Post</span>
                  </Button>
                </Link>
                <Link href="/qa?action=ask">
                  <Button variant="outline" className="w-full h-20 rounded-2xl flex flex-col items-center justify-center gap-1 bg-white/[0.01]">
                    <HelpCircle className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs">Ask Question</span>
                  </Button>
                </Link>
                <Link href="/events?action=create">
                  <Button variant="outline" className="w-full h-20 rounded-2xl flex flex-col items-center justify-center gap-1 bg-white/[0.01]">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs">Create Event</span>
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full h-20 rounded-2xl flex flex-col items-center justify-center gap-1 bg-white/[0.01]">
                    <MessageCircle className="h-5 w-5 text-cyan-400" />
                    <span className="text-xs">Direct Messages</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Announcement spotlight */}
          {pinnedAnn && (
            <Card className="overflow-hidden border-amber-500/20 bg-amber-500/[0.02]">
              <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/10">
                <CardTitle className="text-xs font-bold text-amber-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Megaphone className="h-4.5 w-4.5" /> High-Priority Spotlight
                </CardTitle>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[9px] font-bold">
                  SYSTEM PIN
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <h4 className="text-sm font-bold text-foreground">{pinnedAnn.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{pinnedAnn.content}</p>
                <div className="pt-2">
                  <Link href="/announcements">
                    <Button variant="ghost" size="sm" className="!p-0 text-amber-400 text-xs font-bold hover:text-amber-300 border-0">
                      View all system alerts <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personalized Recommendation Engine */}
          <Card className="bg-linear-to-b from-cyan-500/[0.03] to-transparent border-cyan-500/10">
            <CardHeader className="pb-3 border-b border-border/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <CardTitle className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="h-4.5 w-4.5" /> Recommendation Engine
              </CardTitle>
              {/* Tab Selector */}
              <div className="flex space-x-1.5 bg-black/20 p-1 rounded-xl">
                {(["spaces", "careers", "files"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRecTab(tab)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeRecTab === tab
                        ? "bg-card text-cyan-400 shadow-xs border border-cyan-500/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "spaces" ? "Communities" : tab === "careers" ? "Jobs" : "Shared Docs"}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {activeRecTab === "spaces" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedComms.map((c) => (
                    <div key={c.id} className="p-3 bg-secondary/40 border border-border/20 rounded-xl space-y-2 flex flex-col justify-between text-xs">
                      <div className="space-y-1">
                        <span className="text-2xl">{c.logo}</span>
                        <p className="font-bold text-foreground line-clamp-1">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
                      </div>
                      <Link href="/communities" className="pt-2">
                        <Button variant="outline" size="sm" className="w-full text-[9px] !py-1">Join</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {activeRecTab === "careers" && (
                <div className="space-y-3">
                  {recommendedJobs.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2">No matching jobs for current interest set.</p>
                  ) : (
                    recommendedJobs.map((j) => (
                      <div key={j.id} className="p-3.5 bg-secondary/40 border border-border/20 rounded-xl flex items-center justify-between text-xs gap-3">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground">{j.title}</p>
                          <p className="text-[10px] text-primary font-semibold">{j.company} • {j.location}</p>
                        </div>
                        <Link href="/jobs">
                          <Button variant="outline" size="sm" className="text-[10px] !py-1">View Job</Button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeRecTab === "files" && (
                <div className="space-y-3">
                  {recommendedResources.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2">No department documents shared yet.</p>
                  ) : (
                    recommendedResources.map((r) => (
                      <div key={r.id} className="p-3.5 bg-secondary/40 border border-border/20 rounded-xl flex items-center justify-between text-xs gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">{r.category}</span>
                            <span className="text-[9px] text-zinc-500 font-semibold">{r.downloadsCount} downloads</span>
                          </div>
                          <p className="font-bold text-foreground">{r.title}</p>
                        </div>
                        <Link href="/resources">
                          <Button variant="outline" size="sm" className="text-[10px] !py-1">Download</Button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Leaderboards and Events */}
        <div className="space-y-6">
          {/* Reputation Leaderboard */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-amber-500" /> Reputation Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {leaderboardUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/10 transition-colors">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-extrabold w-4 text-center text-muted-foreground">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </span>
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-foreground flex items-center gap-1">
                          {user.name}
                          {user.verificationStatus === "verified" && (
                            <span className="text-[10px] text-emerald-400">🛡️</span>
                          )}
                        </p>
                        <p className="text-[9px] text-muted-foreground truncate max-w-[120px]">{user.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{user.reputation}</p>
                      <p className="text-[8px] text-zinc-500 font-semibold uppercase">Rep</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events widget */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-emerald-400" /> Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start space-x-3 p-2.5 rounded-xl bg-secondary/10 border border-border/10">
                    <div className="px-2 py-1.5 bg-primary/10 rounded-lg text-primary text-center font-bold text-[10px] min-w-10">
                      <p className="uppercase text-[8px] font-black">{ev.date.split("-")[1]}</p>
                      <p className="text-sm font-extrabold leading-none">{ev.date.split("-")[2]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{ev.title}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{ev.time} • {ev.location}</p>
                      <Link href="/events">
                        <Button variant="ghost" size="sm" className="text-[10px] !p-0 mt-1 hover:text-primary border-0">
                          Register RSVP
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
