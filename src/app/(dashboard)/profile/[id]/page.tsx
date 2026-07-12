"use client";

import React, { useState, use } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Award, Rss, UserCheck, Calendar, ShieldCheck, Mail, Edit3, Heart } from "lucide-react";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const { currentUser, users, posts, communities } = useStore();
  
  const [activeTab, setActiveTab] = useState("posts");

  const user = users.find((u) => u.id === userId);
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground font-semibold">User profile not found in mock database.</p>
      </div>
    );
  }

  const isMe = user.id === currentUser?.id;
  
  // User's posts
  const userPosts = posts.filter((p) => p.authorId === user.id);

  // User's joined communities
  const userComms = communities.filter((c) => c.members.includes(user.id));

  return (
    <div className="space-y-6">
      
      {/* Cover Panel card */}
      <Card className="overflow-hidden border-border/40 relative">
        <div className="h-32 bg-linear-to-r from-violet-600/30 via-indigo-600/20 to-transparent absolute top-0 left-0 right-0" />
        
        <CardContent className="pt-20 px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-5 text-center md:text-left">
            <img
              src={user.avatar}
              alt=""
              className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-2xl relative -mt-10"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-1.5">
                <h2 className="text-lg font-black text-white">{user.name}</h2>
                {user.verificationStatus === "verified" && (
                  <span className="text-emerald-400 p-0.5" title="Verified organization member">
                    <ShieldCheck className="h-5 w-5 fill-emerald-500/10" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-semibold">@{user.username}</p>
              <p className="text-xs text-zinc-300 pt-1 leading-snug">{user.title}</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3.5 self-center md:self-auto">
            {isMe ? (
              <Link href="/settings">
                <Button variant="outline" className="rounded-xl flex items-center gap-1.5 text-xs font-bold border-border/40 bg-secondary/10">
                  <Edit3 className="h-4 w-4 text-violet-400" /> Edit Profile
                </Button>
              </Link>
            ) : (
              <Link href={`/chat`}>
                <Button variant="primary" className="rounded-xl flex items-center gap-1.5 text-xs font-bold">
                  <Mail className="h-4 w-4" /> Send Direct Message
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid structure: Left Info, Right Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column stats */}
        <div className="space-y-6">
          {/* Reputation Card */}
          <Card className="bg-linear-to-r from-violet-500/[0.02] to-transparent">
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Community Rep</p>
                <Award className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{user.reputation}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                  Earned by posting questions, answers, comments, and receiving upvotes in hubs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Badges and Milestones */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Achievements & Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {user.badges.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No badges unlocked yet.</p>
              ) : (
                <div className="space-y-3">
                  {user.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-2xl border flex items-start space-x-3 transition-all ${badge.color}`}
                    >
                      <span className="text-2xl p-1 bg-black/10 rounded-xl">{badge.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{badge.name}</p>
                        <p className="text-[9px] text-zinc-300 mt-1 leading-snug">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Joined Communities */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Member of Spaces
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {userComms.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Has not joined any communities.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userComms.map((comm) => (
                    <Link key={comm.id} href="/communities">
                      <span className="px-2.5 py-1.5 rounded-xl border border-border/40 bg-secondary/15 hover:bg-secondary/40 text-xs font-bold flex items-center gap-1.5 transition-colors">
                        <span>{comm.logo}</span>
                        <span>{comm.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column content tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs
            tabs={[
              { id: "posts", label: `Recent Activity (${userPosts.length})` },
              { id: "about", label: "About & Info" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="line"
          />

          <div className="space-y-4">
            {activeTab === "posts" && (
              <div className="space-y-4">
                {userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xs text-muted-foreground">No recent posts written by this user.</p>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <Card key={post.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Posted {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-rose-500" />
                          {Object.values(post.reactions).reduce((sum, curr) => sum + curr.length, 0)} reactions
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                        {post.content}
                      </p>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === "about" && (
              <Card>
                <CardContent className="pt-6 space-y-6 text-xs leading-relaxed">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Biography</p>
                    <p className="text-zinc-300 text-sm">{user.bio || "No biography provided yet."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Joined Network</p>
                      <p className="font-bold text-white text-xs">{new Date(user.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Organization Association</p>
                      <p className="font-bold text-white text-xs">
                        {user.org ? user.org.name : "Unassociated / Unverified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
