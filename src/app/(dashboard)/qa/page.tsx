"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import {
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  Eye,
  Plus,
  Search,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Tag,
  ArrowLeft,
  Award,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function QAContent() {
  const searchParams = useSearchParams();
  const {
    currentUser,
    qaQuestions,
    qaAnswers,
    users,
    askQuestion,
    answerQuestion,
    voteQuestion,
    voteAnswer,
    acceptAnswer
  } = useStore();

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Ask Question Form States
  const [askTitle, setAskTitle] = useState("");
  const [askContent, setAskContent] = useState("");
  const [askTags, setAskTags] = useState("");

  // Answer Form State
  const [newAnswerContent, setNewAnswerContent] = useState("");

  // Auto-open ask dialog if routed with "?action=ask"
  useEffect(() => {
    if (searchParams.get("action") === "ask") {
      setAskOpen(true);
    }
  }, [searchParams]);

  // Filter Questions
  const filteredQuestions = qaQuestions.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.content.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askTitle.trim() || !askContent.trim()) return;

    const tagsArray = askTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    askQuestion(askTitle, askContent, tagsArray);
    
    // reset
    setAskTitle("");
    setAskContent("");
    setAskTags("");
    setAskOpen(false);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestionId || !newAnswerContent.trim()) return;

    answerQuestion(activeQuestionId, newAnswerContent);
    setNewAnswerContent("");
  };

  const activeQuestion = qaQuestions.find((q) => q.id === activeQuestionId);
  const activeQuestionAnswers = qaAnswers.filter((a) => a.questionId === activeQuestionId);
  
  // Sort answers so the accepted one is at the top
  const sortedAnswers = [...activeQuestionAnswers].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    return b.votes - a.votes;
  });

  return (
    <div className="space-y-6">
      
      <AnimatePresence mode="wait">
        {!activeQuestion ? (
          // 1. QUESTIONS EXPLORER LIST
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-violet-400" /> Q&A Forum
                </h2>
                <p className="text-xs text-muted-foreground">Ask questions, share expertise, and earn reputation points.</p>
              </div>
              <Button
                variant="primary"
                onClick={() => setAskOpen(true)}
                className="flex items-center gap-1.5 rounded-xl shadow-md shadow-primary/10"
              >
                <Plus className="h-4.5 w-4.5" /> Ask Question
              </Button>
            </div>

            {/* Search query box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search tags or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 bg-secondary/45 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {/* Questions Grid */}
            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <p className="text-base font-bold text-foreground">No questions found</p>
                  <p className="text-xs text-muted-foreground">Ask a new question to prompt the workspace team.</p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const author = users.find((u) => u.id === q.authorId);
                  
                  return (
                    <Card key={q.id} hoverEffect className="flex flex-col md:flex-row items-stretch overflow-hidden border-border/40">
                      {/* Left Score Column */}
                      <div className="md:w-36 bg-secondary/10 px-4 py-5 flex md:flex-col items-center justify-around md:justify-center gap-4 text-center border-b md:border-b-0 md:border-r border-border/25">
                        <div>
                          <p className="text-sm font-bold text-foreground">{q.votes}</p>
                          <p className="text-[9px] uppercase font-black text-muted-foreground tracking-wider">Votes</p>
                        </div>
                        <div className={`p-1.5 px-3 rounded-xl ${q.acceptedAnswerId ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : ""}`}>
                          <p className="text-sm font-bold">{q.answersCount}</p>
                          <p className="text-[9px] uppercase font-black tracking-wider">Answers</p>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{q.views}</span>
                        </div>
                      </div>

                      {/* Right Details Column */}
                      <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <button
                            onClick={() => {
                              setActiveQuestionId(q.id);
                              // Increment views in database
                              q.views += 1;
                            }}
                            className="text-sm font-extrabold text-foreground hover:text-primary transition-colors text-left font-sans block leading-snug"
                          >
                            {q.title}
                          </button>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {q.content}
                          </p>
                        </div>

                        {/* Tags & Meta footer */}
                        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {q.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-lg bg-secondary text-[10px] text-muted-foreground font-semibold flex items-center gap-1 border border-border/20">
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <img src={author?.avatar} alt="" className="w-5.5 h-5.5 rounded-md object-cover" />
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {author?.name} • {new Date(q.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          // 2. QUESTION THREAD DETAIL VIEW
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveQuestionId(null)}
              className="text-zinc-400 hover:text-white !p-0 border-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Q&A explorer
            </Button>

            {/* Main Question Card */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-start space-x-4">
                  {/* Upvote/Downvote Question */}
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => voteQuestion(activeQuestion.id, "up")}
                      className={`p-1.5 rounded-xl border border-border/30 hover:bg-secondary transition-all cursor-pointer ${
                        activeQuestion.upvotedBy.includes(currentUser?.id || "") ? "bg-primary/10 text-primary border-primary/20" : ""
                      }`}
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-black text-foreground">{activeQuestion.votes}</span>
                    <button
                      onClick={() => voteQuestion(activeQuestion.id, "down")}
                      className={`p-1.5 rounded-xl border border-border/30 hover:bg-secondary transition-all cursor-pointer ${
                        activeQuestion.downvotedBy.includes(currentUser?.id || "") ? "bg-destructive/10 text-destructive border-destructive/20" : ""
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-extrabold text-foreground leading-snug">{activeQuestion.title}</h3>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Asked by <b>{users.find((u) => u.id === activeQuestion.authorId)?.name}</b> on {new Date(activeQuestion.createdAt).toLocaleDateString()}
                    </p>
                    <hr className="border-border/10" />
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {activeQuestion.content}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pl-9">
                  {activeQuestion.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-lg bg-secondary text-[10px] text-muted-foreground font-semibold flex items-center gap-1 border border-border/20">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Answers count header */}
            <div className="border-b border-border/20 pb-2">
              <h4 className="font-extrabold text-sm text-foreground">Answers ({sortedAnswers.length})</h4>
            </div>

            {/* Answers list */}
            <div className="space-y-4">
              {sortedAnswers.map((ans) => {
                const answerAuthor = users.find((u) => u.id === ans.authorId);
                const isQuestionAuthor = activeQuestion.authorId === currentUser?.id;
                
                return (
                  <Card key={ans.id} className={`border-border/40 ${ans.isAccepted ? "border-emerald-500/30 bg-emerald-500/[0.01]" : ""}`}>
                    <CardContent className="pt-5 space-y-4">
                      <div className="flex items-start space-x-4">
                        {/* Vote Answer */}
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            onClick={() => voteAnswer(ans.id, "up")}
                            className={`p-1.5 rounded-xl border border-border/30 hover:bg-secondary cursor-pointer ${
                              ans.upvotedBy.includes(currentUser?.id || "") ? "bg-primary/10 text-primary border-primary/20" : ""
                            }`}
                          >
                            <ChevronUp className="h-4.5 w-4.5" />
                          </button>
                          <span className="text-xs font-black text-foreground">{ans.votes}</span>
                          <button
                            onClick={() => voteAnswer(ans.id, "down")}
                            className={`p-1.5 rounded-xl border border-border/30 hover:bg-secondary cursor-pointer ${
                              ans.downvotedBy.includes(currentUser?.id || "") ? "bg-destructive/10 text-destructive border-destructive/20" : ""
                            }`}
                          >
                            <ChevronDown className="h-4.5 w-4.5" />
                          </button>
                        </div>

                        {/* Answer Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center space-x-2">
                              <img src={answerAuthor?.avatar} alt="" className="w-6 h-6 rounded-md object-cover" />
                              <p className="text-xs font-bold text-foreground">
                                {answerAuthor?.name}
                                <span className="text-[10px] text-muted-foreground font-semibold ml-2">
                                  {answerAuthor?.title}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Accepted Answer indicators */}
                              {ans.isAccepted && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-400 text-[9px] font-black border border-emerald-500/25 flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> SOLVED
                                </span>
                              )}

                              {isQuestionAuthor && !activeQuestion.acceptedAnswerId && (
                                <Button
                                  variant="glass"
                                  size="sm"
                                  onClick={() => acceptAnswer(activeQuestion.id, ans.id)}
                                  className="text-[9px] !py-1 !px-2 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10"
                                >
                                  Accept Answer
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-foreground/95 whitespace-pre-wrap leading-relaxed pt-2">
                            {ans.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Answer Composer */}
            <Card>
              <CardHeader className="pb-2 border-b border-border/10">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Write Your Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Provide details or code examples to answer this query..."
                    value={newAnswerContent}
                    onChange={(e) => setNewAnswerContent(e.target.value)}
                    required
                  />
                  <Button variant="primary" className="shadow-md shadow-primary/10" type="submit">
                    Post Answer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ASK QUESTION MODAL */}
      <Dialog isOpen={askOpen} onClose={() => setAskOpen(false)} title="Ask a Community Question">
        <form onSubmit={handleAskSubmit} className="space-y-4">
          <Input
            label="Question Title"
            placeholder="e.g. How to handle state synchronization in Zustand stores?"
            value={askTitle}
            onChange={(e) => setAskTitle(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Context"
            placeholder="Explain the problem, library parameters, or error messages..."
            value={askContent}
            onChange={(e) => setAskContent(e.target.value)}
            required
          />

          <Input
            label="Tags (Comma separated)"
            placeholder="e.g. nextjs, zustand, react"
            value={askTags}
            onChange={(e) => setAskTags(e.target.value)}
            required
          />

          <div className="flex items-center space-x-3 pt-3 border-t border-border/10">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setAskOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 shadow-md shadow-primary/15"
              disabled={!askTitle.trim() || !askContent.trim()}
            >
              Post Question
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}

export default function QAPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading forum questions...</div>}>
      <QAContent />
    </Suspense>
  );
}
