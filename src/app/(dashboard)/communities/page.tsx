"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Users, Search, Plus, Compass, Sparkles, Lock, Unlock, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function CommunitiesPage() {
  const { currentUser, communities, joinCommunity, createCommunity } = useStore();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Create Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState<any>("study");
  const [newPrivate, setNewPrivate] = useState(false);

  // Filters
  const filtered = communities.filter((comm) => {
    const matchesSearch =
      comm.name.toLowerCase().includes(search.toLowerCase()) ||
      comm.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || comm.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    createCommunity(newName, newDesc, newCat, newPrivate);
    
    // Reset and close
    setNewName("");
    setNewDesc("");
    setNewCat("study");
    setNewPrivate(false);
    setCreateOpen(false);
  };

  const categories = [
    { id: "all", label: "Explore All" },
    { id: "study", label: "Study & Academics" },
    { id: "work", label: "Work & Professional" },
    { id: "gaming", label: "Gaming & Esports" },
    { id: "general", label: "Social & General" },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Compass className="h-6 w-6 text-violet-400" /> Discover Communities
          </h2>
          <p className="text-xs text-muted-foreground">Join verified group hubs for your organization channels.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 self-start md:self-auto rounded-xl shadow-md shadow-primary/10"
        >
          <Plus className="h-4.5 w-4.5" /> Create Community
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-secondary/45 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "border-border/40 bg-secondary/15 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of communities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 space-y-2">
            <p className="text-base font-bold text-foreground">No communities found</p>
            <p className="text-xs text-muted-foreground">Adjust your query or create a new community hub.</p>
          </div>
        ) : (
          filtered.map((comm) => {
            const isJoined = comm.members.includes(currentUser?.id || "");
            
            return (
              <Card key={comm.id} hoverEffect className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <span className="text-3.5xl p-2.5 rounded-2xl bg-secondary/85 border border-border/30">{comm.logo}</span>
                  <Button
                    variant={isJoined ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => joinCommunity(comm.id)}
                    className="rounded-xl flex items-center gap-1 text-[11px] font-bold border-0"
                  >
                    {isJoined ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Joined
                      </>
                    ) : (
                      "Join Space"
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-sm font-bold text-foreground">{comm.name}</CardTitle>
                      {comm.isPrivate ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5 text-zinc-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {comm.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/10 text-[10px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-indigo-400" />
                      {comm.memberCount} members
                    </span>
                    <span className="uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary/70 border border-border/20 text-[8px] font-black">
                      {comm.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* CREATE MODAL */}
      <Dialog isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create a Community Hub">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Community Name"
            placeholder="e.g. Campus Chess Club"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="What is the focus of this space? Detail topics or criteria..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground focus:outline-hidden border-border/40 focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="study">Study & Academics</option>
                <option value="work">Work & Professional</option>
                <option value="gaming">Gaming & Esports</option>
                <option value="general">Social & General</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Privacy</label>
              <select
                value={newPrivate ? "private" : "public"}
                onChange={(e) => setNewPrivate(e.target.value === "private")}
                className="w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground focus:outline-hidden border-border/40 focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="public">Public (Open join)</option>
                <option value="private">Private (Invite required)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-border/10">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 shadow-md shadow-primary/15"
              disabled={!newName.trim() || !newDesc.trim()}
            >
              Create Space
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
