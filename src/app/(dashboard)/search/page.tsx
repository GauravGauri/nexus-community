"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Users, Rss, User as UserIcon, HelpCircle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");

  const { posts, communities, users, qaQuestions } = useStore();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Filtering Logic
  const filteredPosts = posts.filter(
    (p) => p.content.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredCommunities = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQA = qaQuestions.filter(
    (q) =>
      q.title.toLowerCase().includes(query.toLowerCase()) ||
      q.content.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults =
    filteredPosts.length + filteredCommunities.length + filteredUsers.length + filteredQA.length;

  return (
    <div className="space-y-6">
      {/* Search Input Panel */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <SearchIcon className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts, users, Q&A, communities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-secondary/40 text-sm text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/40"
            />
          </form>
          {query && (
            <p className="text-xs text-muted-foreground mt-3 font-semibold">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} matching &quot;{query}&quot;
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "all", label: "All Results" },
          { id: "posts", label: `Posts (${filteredPosts.length})` },
          { id: "communities", label: `Communities (${filteredCommunities.length})` },
          { id: "people", label: `People (${filteredUsers.length})` },
          { id: "qa", label: `Q&A (${filteredQA.length})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="line"
      />

      {/* Results grid */}
      <div className="space-y-4">
        {totalResults === 0 && query && (
          <div className="text-center py-12 space-y-2">
            <p className="text-lg font-bold text-foreground">No matches found</p>
            <p className="text-sm text-muted-foreground">Try spelling it differently or use broad terms.</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm text-muted-foreground">Type a query in the search box above to explore Nexus Campus content.</p>
          </div>
        )}

        {/* 1. COMMUNITIES RESULTS */}
        {(activeTab === "all" || activeTab === "communities") && filteredCommunities.length > 0 && (
          <div className="space-y-3">
            {activeTab === "all" && (
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Users className="h-4 w-4" /> Communities
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities.map((c) => (
                <Card key={c.id} hoverEffect>
                  <CardHeader className="flex flex-row items-center space-x-3.5 space-y-0 p-4">
                    <span className="text-3xl p-2 rounded-2xl bg-secondary/80">{c.logo}</span>
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">{c.name}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{c.memberCount} members</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
                    <Link href="/communities" className="inline-block mt-3">
                      <Button variant="outline" size="sm" className="text-[10px] !py-1">Visit Hub</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 2. PEOPLE RESULTS */}
        {(activeTab === "all" || activeTab === "people") && filteredUsers.length > 0 && (
          <div className="space-y-3 pt-4">
            {activeTab === "all" && (
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <UserIcon className="h-4 w-4" /> People
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredUsers.map((u) => (
                <Card key={u.id} hoverEffect className="p-4 flex items-center space-x-3">
                  <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate flex items-center gap-1">
                      {u.name}
                      {u.verificationStatus === "verified" && <span className="text-[10px] text-emerald-400">🛡️</span>}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.title}</p>
                    <Link href={`/profile/${u.id}`} className="text-[9px] text-primary hover:underline font-bold mt-1 inline-block">
                      View Profile
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 3. POSTS RESULTS */}
        {(activeTab === "all" || activeTab === "posts") && filteredPosts.length > 0 && (
          <div className="space-y-3 pt-4">
            {activeTab === "all" && (
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Rss className="h-4 w-4" /> Feed Posts
              </h3>
            )}
            <div className="space-y-3">
              {filteredPosts.map((p) => {
                const author = users.find((u) => u.id === p.authorId);
                return (
                  <Card key={p.id} className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <img src={author?.avatar} alt="" className="w-6 h-6 rounded-md object-cover" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{author?.name}</p>
                        <p className="text-[9px] text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{p.content}</p>
                    <Link href="/feed" className="inline-block pt-1">
                      <Button variant="ghost" size="sm" className="text-[10px] !p-0 hover:text-primary border-0">
                        View post thread <ArrowRight className="h-3 w-3 ml-0.5 inline" />
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Q&A RESULTS */}
        {(activeTab === "all" || activeTab === "qa") && filteredQA.length > 0 && (
          <div className="space-y-3 pt-4">
            {activeTab === "all" && (
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <HelpCircle className="h-4 w-4" /> Q&A Forum Questions
              </h3>
            )}
            <div className="space-y-3">
              {filteredQA.map((q) => (
                <Card key={q.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href="/qa" className="font-bold text-xs text-foreground hover:text-primary transition-colors line-clamp-1">
                      {q.title}
                    </Link>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{q.content}</p>
                  </div>
                  <div className="text-center min-w-[60px] p-2 bg-secondary/50 rounded-xl">
                    <p className="text-xs font-bold text-foreground">{q.votes}</p>
                    <p className="text-[8px] text-muted-foreground uppercase font-black">Votes</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading search query...</div>}>
      <SearchContent />
    </Suspense>
  );
}
