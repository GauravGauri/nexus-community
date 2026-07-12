"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drawer } from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Rss,
  Users,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Calendar,
  Megaphone,
  Bell,
  Sun,
  Moon,
  Search,
  LogOut,
  User as UserIcon,
  Settings,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Check,
  Send,
  Building,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  // Zustand state
  const {
    currentUser,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    orgs
  } = useStore();

  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // AI Drawer state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiChat, setAiChat] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! I am your Nexus AI Assistant. Ask me to summarize community activity, find mentorship recommendations, or check trending questions." }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  // Redirect if logged out (Auth Guard)
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          <p className="text-sm text-muted-foreground font-medium">Securing session...</p>
        </div>
      </div>
    );
  }

  // Auto-close mobile menu on path changes
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Nav Items configuration
  const primaryNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Feed", href: "/feed", icon: Rss },
    { name: "Communities", href: "/communities", icon: Users },
    { name: "Group Chat", href: "/chat", icon: MessageSquare },
    { name: "Q&A Board", href: "/qa", icon: HelpCircle },
    { name: "Polls", href: "/polls", icon: BarChart3 },
    { name: "Events Calendar", href: "/events", icon: Calendar },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
  ];

  const adminNav = [];
  if (currentUser.role === "admin") {
    adminNav.push({ name: "Admin Panel", href: "/admin", icon: Settings });
  }
  if (currentUser.role === "moderator" || currentUser.role === "admin") {
    adminNav.push({ name: "Moderator Panel", href: "/moderator", icon: ShieldAlert });
  }

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
    }
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userMsg = aiMessage;
    setAiChat((prev) => [...prev, { sender: "user", text: userMsg }]);
    setAiMessage("");
    setAiTyping(true);

    // Simulate AI response based on keyword matching
    setTimeout(() => {
      setAiTyping(false);
      let reply = "I've checked the workspace database. How else can I help you navigate the community?";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes("summary") || lower.includes("feed") || lower.includes("trending")) {
        reply = "Currently, there is high engagement in the #UI/UX Designers community about migrating to Tailwind v4. Leo Sterling has also shared a Q&A question about Framer Motion layout animations.";
      } else if (lower.includes("mentorship") || lower.includes("mentor") || lower.includes("help")) {
        reply = "I found 2 active mentors matches for you: Elena Vance (Lead UI Designer @ Vercel Labs, expert in CSS Glassmorphism) and Alex Rivera (Engineering Director, expert in algorithm coding mocks).";
      } else if (lower.includes("event") || lower.includes("hackathon") || lower.includes("workshop")) {
        reply = "Upcoming events: The 'Tailwind CSS v4 Workshop' by Elena Vance is scheduled for July 18th (Online), and the 'Nexus AI Hackathon' starts on July 24th at the Innovation Hub.";
      } else if (lower.includes("verified") || lower.includes("badge") || lower.includes("verification")) {
        reply = "To unlock the Verified Member shield badge, go to Settings -> Verification and upload your Student ID or enter invite code 'NEXUS-2026'.";
      }

      setAiChat((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* 1. SIDEBAR (DESKTOP) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/65 backdrop-blur-md sticky top-0 h-screen z-20">
        {/* Header/Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/20">
          <Link href="/dashboard" className="flex items-center space-x-2.5 font-bold tracking-tight text-foreground group">
            <div className="p-1.5 rounded-lg bg-linear-to-r from-violet-500 to-indigo-500 text-white shadow-xs">
              <Building className="h-5 w-5" />
            </div>
            <span className="text-lg">Nexus <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Campus</span></span>
          </Link>
        </div>

        {/* Navigation lists */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Main Menu</p>
            {primaryNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {adminNav.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">Admin Tools</p>
              {adminNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <span
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? "bg-amber-600 text-white shadow-md shadow-amber-600/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* User Quick Info */}
        <div className="p-4 border-t border-border/20 bg-secondary/15">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border border-border"
              />
              {currentUser.verificationStatus === "verified" && (
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-white border border-card shadow-xs">
                  <Check className="h-2 w-2 stroke-[3]" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-foreground">{currentUser.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[10px] font-bold text-muted-foreground">{currentUser.reputation} Rep</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="!p-1.5 rounded-xl text-muted-foreground hover:text-destructive border-0"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <LogOut className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-45 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            {/* Slide menu */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-72 h-full bg-card border-r border-border/40 flex flex-col p-5 space-y-6 z-10 glass"
            >
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2 font-bold" onClick={closeMobileMenu}>
                  <div className="p-1 rounded bg-primary text-white">
                    <Building className="h-4 w-4" />
                  </div>
                  <span>Nexus Campus</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={closeMobileMenu} className="!p-1 rounded-full border-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {primaryNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                      <span
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}

                {adminNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                      <span
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-amber-600 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
                    <p className="text-[10px] text-muted-foreground">{currentUser.reputation} Reputation</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="!p-1 border-0"
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* HEADER BAR */}
        <header className="h-16 border-b border-border/30 bg-card/45 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {/* Hamburger Trigger for Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden !p-1.5 rounded-xl border-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Org Identity details */}
            <div className="flex items-center space-x-2 bg-secondary/40 border border-border/40 rounded-full py-1 pl-1 pr-3 max-w-xs md:max-w-none">
              {currentUser.org ? (
                <>
                  <img
                    src={currentUser.org.logo}
                    alt={currentUser.org.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-foreground truncate max-w-[120px] md:max-w-none">
                    {currentUser.org.name}
                  </span>
                  <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-bold border border-emerald-500/20">
                    VERIFIED
                  </span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-[10px]">
                    ⚠️
                  </div>
                  <span className="text-xs font-bold text-amber-500">Unverified guest</span>
                  <Link href="/verify-org" className="text-[10px] text-primary hover:underline font-bold">
                    Verify
                  </Link>
                </>
              )}
            </div>

            {/* Desktop Autocomplete search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-64 lg:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search posts, Q&As, communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-9.5 pr-4 py-1.5 bg-secondary/55 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-full border border-border/40 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/40"
              />
              {/* Autocomplete Quick Matches */}
              <AnimatePresence>
                {searchFocused && searchQuery.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 left-0 right-0 border border-border/50 bg-card rounded-2xl p-3 shadow-2xl z-50 glass"
                  >
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Search Matches</p>
                    <div className="space-y-1 text-xs">
                      <button
                        type="submit"
                        className="w-full text-left p-2 rounded-lg hover:bg-secondary/60 flex items-center justify-between"
                      >
                        <span className="font-semibold text-foreground truncate">&quot;{searchQuery}&quot;</span>
                        <span className="text-[10px] text-muted-foreground">Press Enter to search</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Switcher */}
            <Button
              variant="ghost"
              size="sm"
              className="!p-2 rounded-full border-0"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4.5 w-4.5 text-foreground rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4.5 w-4.5 text-foreground rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* AI Floating Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="!p-2 rounded-full relative border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-500 border-0"
              onClick={() => setAiOpen(true)}
            >
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            </Button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`!p-2 rounded-full border-0 ${notifDropdownOpen ? "bg-secondary" : ""}`}
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              >
                <Bell className="h-4.5 w-4.5 text-foreground" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-ping" />
                )}
              </Button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border/50 rounded-2xl shadow-2xl p-4 z-50 glass"
                    >
                      <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-3">
                        <h4 className="text-xs font-bold text-foreground">Notifications</h4>
                        {unreadNotifs.length > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-[10px] text-primary hover:underline font-bold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        {notifications.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No notifications yet.</p>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markNotificationRead(notif.id);
                                setNotifDropdownOpen(false);
                                // Navigate dynamically
                                if (notif.type === "chat") router.push("/chat");
                                if (notif.type === "comment" || notif.type === "like") router.push("/feed");
                                if (notif.type === "reputation") router.push("/qa");
                              }}
                              className={`p-2.5 rounded-xl border border-transparent transition-all cursor-pointer ${
                                !notif.read
                                  ? "bg-primary/5 hover:bg-primary/10 border-primary/10"
                                  : "hover:bg-secondary/40"
                              }`}
                            >
                              <p className="font-bold text-foreground flex items-center justify-between">
                                <span>{notif.title}</span>
                                {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                              </p>
                              <p className="text-muted-foreground text-[10px] mt-0.5 leading-snug">{notif.content}</p>
                              <p className="text-[9px] text-zinc-500 mt-1 font-semibold">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown menu */}
            <div className="relative">
              <button
                className="flex items-center space-x-1.5 focus:outline-hidden cursor-pointer"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-border"
                />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border/50 rounded-2xl shadow-2xl p-2 z-50 glass"
                    >
                      <div className="p-3 border-b border-border/20">
                        <p className="text-xs font-bold text-foreground leading-none">{currentUser.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">{currentUser.email}</p>
                      </div>
                      <div className="p-1 space-y-0.5 text-xs font-medium">
                        <Link href={`/profile/${currentUser.id}`} onClick={() => setProfileDropdownOpen(false)}>
                          <span className="flex items-center space-x-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/40">
                            <UserIcon className="h-4 w-4" />
                            <span>My Profile</span>
                          </span>
                        </Link>
                        <Link href="/settings" onClick={() => setProfileDropdownOpen(false)}>
                          <span className="flex items-center space-x-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/40">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            router.push("/login");
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10 text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* WORKSPACE PAGES WRAPPER */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 4. AI ASSISTANT DRAWER PANEL */}
      <Drawer isOpen={aiOpen} onClose={() => setAiOpen(false)} title="Nexus AI Companion">
        <div className="flex flex-col h-[75vh]">
          {/* Chat Logs */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 text-xs">
            {aiChat.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl max-w-[85%] border leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary border-primary/20 text-white ml-auto"
                    : "bg-secondary/60 border-border/30 text-foreground"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {aiTyping && (
              <div className="bg-secondary/60 border border-border/30 p-3 rounded-2xl max-w-[80%] flex items-center space-x-1.5">
                <span className="h-2 w-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          {/* Quick prompt suggestions */}
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Suggested Actions</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setAiMessage("Summarize community design feed activity")}
                className="text-[10px] border border-cyan-500/10 hover:border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-1 rounded-lg"
              >
                📝 Summarize Design Feed
              </button>
              <button
                onClick={() => setAiMessage("Suggest verified mentors for UI UX and React")}
                className="text-[10px] border border-cyan-500/10 hover:border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-1 rounded-lg"
              >
                🤝 Match UI/UX Mentors
              </button>
              <button
                onClick={() => setAiMessage("What are the upcoming events this week?")}
                className="text-[10px] border border-cyan-500/10 hover:border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 font-semibold px-2 py-1 rounded-lg"
              >
                📅 Weekly Events List
              </button>
            </div>
          </div>

          {/* Input Box */}
          <form onSubmit={handleAiSend} className="flex gap-2 border-t border-border/20 pt-4 mt-auto">
            <input
              type="text"
              placeholder="Ask AI..."
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              className="flex-1 px-4 py-2 text-xs bg-secondary/85 text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:ring-1 focus:ring-cyan-500/60"
            />
            <Button variant="primary" className="!bg-cyan-600 hover:shadow-cyan-600/20 text-white" type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Drawer>
    </div>
  );
}
