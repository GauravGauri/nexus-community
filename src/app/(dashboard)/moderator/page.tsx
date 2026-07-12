"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Trash2, CheckCircle2, ShieldOff, AlertCircle } from "lucide-react";

export default function ModeratorDashboardPage() {
  const { flagged, resolveFlagged } = useStore();

  // Filter pending reports
  const pendingFlags = flagged.filter((f) => f.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-rose-500" /> Moderator Toolkit
        </h2>
        <p className="text-xs text-muted-foreground">Audit reported content snippets, manage violations queues, and dismiss reports.</p>
      </div>

      {/* Flagged items queue list */}
      <Card>
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="h-4.5 w-4.5 text-rose-400 animate-pulse" /> Reported Content Queue ({pendingFlags.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {pendingFlags.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Moderator queue is clean. No pending flags.</p>
          ) : (
            <div className="space-y-4">
              {pendingFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-4 rounded-2xl border border-border/40 bg-secondary/15 flex flex-col md:flex-row items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-extrabold text-[8px] uppercase tracking-wider">
                        {flag.contentType} Reported
                      </span>
                      <span className="text-zinc-500">by {flag.reportedBy}</span>
                    </div>
                    
                    <div className="p-3 bg-background/50 rounded-xl border border-border/20 italic font-mono text-[11px] text-zinc-300">
                      &quot;{flag.contentSnippet}&quot;
                    </div>

                    <p className="text-zinc-400 font-semibold">
                      Reason: <span className="text-foreground">{flag.reason}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto mt-2 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveFlagged(flag.id, "dismiss")}
                      className="flex-1 md:flex-none text-xs font-bold rounded-xl"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-400" /> Dismiss
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => resolveFlagged(flag.id, "delete")}
                      className="flex-1 md:flex-none text-xs font-bold rounded-xl flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete Content
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
