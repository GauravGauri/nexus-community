"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  FileText,
  Pin,
  Calendar,
  Award,
  Sparkles,
  TrendingUp,
  BookOpen,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function DepartmentPage() {
  const { currentUser, posts, users, events, resources, announcements, createPost } = useStore();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostContent, setNewPostContent] = useState("");

  if (!currentUser || !currentUser.department) {
    return (
      <div className="text-center py-16 space-y-4">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">No Department Selected</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Please complete your onboarding profile or edit your settings to assign a department.
        </p>
      </div>
    );
  }

  const userDept = currentUser.department;

  // Filter lists based on user department keywords
  const deptKeyword = userDept.toLowerCase().split(" ")[0] || ""; // e.g. "computer" or "design" or "engineering"
  
  // Filter department posts
  const deptPosts = posts.filter(
    (p) =>
      p.content.toLowerCase().includes(deptKeyword) ||
      (p.communityId && p.communityId.includes(deptKeyword)) ||
      (p.authorId && users.find((u) => u.id === p.authorId)?.department === userDept)
  );

  // Filter department events
  const deptEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(deptKeyword) ||
      e.description.toLowerCase().includes(deptKeyword)
  );

  // Filter resources
  const deptResources = resources.filter(
    (r) => r.department === userDept || r.tags.some((t) => t.toLowerCase().includes(deptKeyword))
  );

  // Filter members of same department
  const deptMembers = users.filter((u) => u.department === userDept);

  // Calculate statistics
  const totalReputation = deptMembers.reduce((sum, m) => sum + m.reputation, 0);
  const averageRep = deptMembers.length > 0 ? Math.round(totalReputation / deptMembers.length) : 0;

  // Find department moderators/admins
  const moderatorsList = deptMembers.filter((m) => m.role === "admin" || m.role === "moderator");
  const fallbackMods = users.filter((u) => u.role === "admin");
  const activeMods = moderatorsList.length > 0 ? moderatorsList : fallbackMods.slice(0, 2);

  // Top contributors in the department
  const topContributors = [...deptMembers]
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 3);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    createPost(newPostContent);
    setNewPostContent("");
  };

  return (
    <div className="space-y-6">
      {/* 1. DEPARTMENT HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-zinc-900 shadow-2xl glass">
        {/* Ambient Blur */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-xs bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10 pt-20">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 text-3xl font-black">
              🏛️
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-primary/80">Department Hub</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">{userDept}</h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Collaborate with peers, download shared academic and work documents, check statistics, and join dynamic workshops.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6 bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-center">
              <span className="text-lg font-bold text-white block">{deptMembers.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Members</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-lg font-bold text-white block">{deptPosts.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Posts</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-lg font-bold text-white block">{averageRep}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">Avg Rep</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Area: Main tab items (Feed, Resources, Members) */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            tabs={[
              { id: "feed", label: `Feed Discussions (${deptPosts.length})` },
              { id: "resources", label: `Shared Library (${deptResources.length})` },
              { id: "members", label: `Peers (${deptMembers.length})` },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="line"
          />

          {/* TAB 1: DISCUSSIONS FEED */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              {/* Post Input */}
              <Card>
                <CardContent className="pt-5">
                  <form onSubmit={handlePostSubmit} className="space-y-3">
                    <Textarea
                      placeholder={`Post an update or question to the ${userDept} department feed...`}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[75px]"
                    />
                    <div className="flex justify-end">
                      <Button variant="primary" size="sm" type="submit">
                        Post to Department
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Feed items */}
              {deptPosts.length === 0 ? (
                <div className="text-center py-10 space-y-3 border border-dashed border-border/40 rounded-2xl">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-semibold text-foreground">No department discussions yet</p>
                  <p className="text-xs text-muted-foreground">Be the first to share an update with your peers.</p>
                </div>
              ) : (
                deptPosts.map((post) => {
                  const author = users.find((u) => u.id === post.authorId);
                  return (
                    <Card key={post.id} className="p-5 space-y-4">
                      <div className="flex items-center space-x-3.5">
                        <img src={author?.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{author?.name}</p>
                          <p className="text-[10px] text-muted-foreground">{author?.title}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-2 border-t border-border/20 pt-3 text-[10px] text-muted-foreground font-semibold">
                        <span>💬 {post.comments.length} comments</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SHARED RESOURCES */}
          {activeTab === "resources" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shared Assets</p>
                <Link href="/resources">
                  <Button variant="outline" size="sm" className="text-[10px] !py-1">Visit Resource Library</Button>
                </Link>
              </div>

              {deptResources.length === 0 ? (
                <div className="text-center py-10 space-y-3 border border-dashed border-border/40 rounded-2xl">
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-semibold text-foreground">No resources shared yet</p>
                  <p className="text-xs text-muted-foreground">Upload class notes, syllabi, or guide slides.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deptResources.map((res) => (
                    <Card key={res.id} hoverEffect>
                      <CardContent className="p-4 space-y-3 flex flex-col justify-between h-full">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                              {res.category}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-semibold">{res.downloadsCount} downloads</span>
                          </div>
                          <p className="font-bold text-xs text-foreground line-clamp-1">{res.title}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {res.description}
                          </p>
                        </div>
                        <a href={res.url} target="_blank" rel="noreferrer" className="pt-2">
                          <Button variant="secondary" size="sm" className="w-full text-[10px] !py-1">
                            Download File
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PEERS */}
          {activeTab === "members" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deptMembers.map((member) => (
                <Card key={member.id} className="p-4 flex items-center space-x-3.5">
                  <img src={member.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-border/25" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{member.title}</p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className="text-[8px] font-bold text-amber-500 bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.2 rounded">
                        {member.reputation} Rep
                      </span>
                      <Link href={`/profile/${member.id}`} className="text-[9px] text-primary font-bold hover:underline">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Area: Portal Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Department Statistics Widget */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                Department Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Members</span>
                <span className="text-foreground font-bold">{deptMembers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cumulative Rep</span>
                <span className="text-foreground font-bold">{totalReputation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Events</span>
                <span className="text-foreground font-bold">{deptEvents.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Department Moderators */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Moderators & Admins
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3">
              {activeMods.map((mod) => (
                <div key={mod.id} className="flex items-center space-x-2 text-xs">
                  <img src={mod.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-foreground">{mod.name}</p>
                    <p className="text-[9px] text-muted-foreground">{mod.title}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Department Upcoming Events */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                Upcoming Workshops
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3.5">
              {deptEvents.length === 0 ? (
                <p className="text-[10px] text-muted-foreground">No workshops scheduled yet.</p>
              ) : (
                deptEvents.slice(0, 2).map((ev) => (
                  <div key={ev.id} className="text-xs space-y-1">
                    <Link href="/events" className="font-bold text-foreground hover:text-primary transition-colors block line-clamp-1">
                      {ev.title}
                    </Link>
                    <p className="text-[10px] text-muted-foreground">
                      📅 {ev.date} at {ev.time}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Top Department Contributors */}
          <Card>
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3">
              {topContributors.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <img src={c.avatar} alt="" className="w-6.5 h-6.5 rounded-lg object-cover" />
                    <span className="font-bold text-foreground truncate">{c.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                    {c.reputation} Rep
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
