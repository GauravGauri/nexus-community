"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { BarChart3, Plus, Calendar, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function PollsPage() {
  const { currentUser, polls, castVote, createPoll, users } = useStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !option1.trim() || !option2.trim()) return;

    const options = [option1, option2];
    if (option3.trim()) options.push(option3);

    createPoll(question, options);

    // reset
    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-violet-400" /> Interactive Polls
          </h2>
          <p className="text-xs text-muted-foreground">Gather feedback, cast your vote, and view live workspace statistics.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl shadow-md shadow-primary/10"
        >
          <Plus className="h-4.5 w-4.5" /> New Poll
        </Button>
      </div>

      {/* Poll list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-muted-foreground">No polls created yet. Click New Poll to initialize one.</p>
          </div>
        ) : (
          polls.map((poll) => {
            const author = users.find((u) => u.id === poll.authorId);
            
            // Calculate total votes
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);

            // Check if current user has voted on this poll
            const userVoteOptionId = poll.options.find((o) => o.votes.includes(currentUser?.id || ""))?.id;

            return (
              <Card key={poll.id} hoverEffect className="flex flex-col h-full border-border/40">
                <CardHeader className="pb-3 border-b border-border/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-semibold">
                      <img src={author?.avatar} alt="" className="w-5.5 h-5.5 rounded-md object-cover" />
                      <span>{author?.name}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-1">
                      <Circle className="h-1.5 w-1.5 fill-violet-500 text-violet-500 animate-pulse" />
                      Live Feed
                    </span>
                  </div>
                  <CardTitle className="text-sm font-extrabold text-foreground leading-snug mt-3">
                    {poll.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-5 flex-1 space-y-4">
                  {/* Poll Options */}
                  <div className="space-y-3.5">
                    {poll.options.map((opt) => {
                      const votesCount = opt.votes.length;
                      const pct = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                      const hasVoted = userVoteOptionId === opt.id;
                      
                      return (
                        <div key={opt.id} className="relative flex flex-col space-y-1">
                          <button
                            onClick={() => castVote(poll.id, opt.id)}
                            className={`w-full p-3 text-left rounded-xl border text-xs font-semibold relative overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-between z-10 ${
                              hasVoted
                                ? "border-primary/40 text-primary bg-primary/5"
                                : "border-border/50 bg-secondary/15 text-foreground hover:bg-secondary/40"
                            }`}
                          >
                            {/* Animated voting background pct bar */}
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ type: "spring", stiffness: 80, damping: 15 }}
                              className="absolute top-0 bottom-0 left-0 bg-primary/10 -z-10"
                            />
                            
                            <span className="truncate max-w-[80%] flex items-center gap-2">
                              {hasVoted && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                              {opt.text}
                            </span>
                            <span className="font-bold">{pct}%</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>

                <div className="px-5 pb-5 border-t border-border/10 pt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                    {totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                    Open until {new Date(poll.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* CREATE MODAL */}
      <Dialog isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create a Workspace Poll">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Poll Question"
            placeholder="e.g. Which design scheme should we use for our company website?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <Input
            label="Choice Option 1"
            placeholder="e.g. Light glassmorphism dashboard"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            required
          />

          <Input
            label="Choice Option 2"
            placeholder="e.g. Dark Linear/Vercel styling dashboard"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            required
          />

          <Input
            label="Choice Option 3 (Optional)"
            placeholder="e.g. Minimal slate paper layout"
            value={option3}
            onChange={(e) => setOption3(e.target.value)}
          />

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
              disabled={!question.trim() || !option1.trim() || !option2.trim()}
            >
              Create Poll
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}
