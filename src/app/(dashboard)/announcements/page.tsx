"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Megaphone, Bell, Calendar, User, Pin } from "lucide-react";

export default function AnnouncementsPage() {
  const { announcements, users } = useStore();
  const [filter, setFilter] = useState("all");

  const getFilteredAnnouncements = () => {
    let list = [...announcements];
    if (filter === "pinned") {
      list = list.filter((a) => a.pinned);
    }
    return list;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-violet-400" /> System Announcements
          </h2>
          <p className="text-xs text-muted-foreground">Stay up-to-date with official organization broadcasts.</p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs font-semibold border border-border/40 bg-secondary/15 rounded-xl px-2.5 py-1.5 focus:outline-hidden text-foreground"
        >
          <option value="all">Show All</option>
          <option value="pinned">Pinned Only</option>
        </select>
      </div>

      {/* Grid List */}
      <div className="space-y-4">
        {getFilteredAnnouncements().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No announcements broadcasted yet.</p>
          </div>
        ) : (
          getFilteredAnnouncements().map((ann) => {
            const author = users.find((u) => u.id === ann.authorId);
            
            return (
              <Card
                key={ann.id}
                className={`relative border-border/40 overflow-hidden ${
                  ann.pinned
                    ? "border-amber-500/20 bg-amber-500/[0.01]"
                    : "bg-card/45"
                }`}
              >
                {ann.pinned && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-black border border-amber-500/20">
                    <Pin className="h-3 w-3" /> PINNED ALERT
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-semibold">
                    <img src={author?.avatar} alt="" className="w-5 h-5 rounded-md object-cover" />
                    <span>{author?.name} • {author?.title}</span>
                  </div>
                  <CardTitle className="text-sm font-extrabold text-foreground leading-snug mt-3">
                    {ann.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs md:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {ann.content}
                  </p>
                  
                  <div className="flex items-center space-x-4 pt-3 border-t border-border/10 text-[9px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      Broadcasted {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bell className="h-3.5 w-3.5 text-violet-400" />
                      Direct Alert Send
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

    </div>
  );
}
