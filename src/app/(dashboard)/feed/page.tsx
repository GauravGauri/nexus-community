"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Drawer } from "@/components/ui/dialog";
import {
  Image,
  MessageCircle,
  Bookmark,
  Share2,
  Flag,
  Flame,
  Heart,
  ThumbsUp,
  Award,
  Sparkles,
  Send,
  MoreVertical,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FeedContent() {
  const searchParams = useSearchParams();
  const {
    currentUser,
    posts,
    users,
    communities,
    createPost,
    deletePost,
    reactToPost,
    addComment,
    reactToComment,
    toggleBookmark,
    flagContent
  } = useStore();

  const [activeTab, setActiveTab] = useState("all");
  
  // Post Creator State
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState("");
  const [newPostCommunity, setNewPostCommunity] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [creatorExpanded, setCreatorExpanded] = useState(false);

  // Comments Drawer State
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");

  // Check if routed with "?action=new-post"
  useEffect(() => {
    if (searchParams.get("action") === "new-post") {
      setCreatorExpanded(true);
    }
  }, [searchParams]);

  // Sorting/Filtering Logic
  const getFilteredPosts = () => {
    let list = [...posts];

    if (activeTab === "bookmarks") {
      list = list.filter((p) => p.bookmarks.includes(currentUser?.id || ""));
    } else if (activeTab === "trending") {
      // Sort by sum of reactions + comments length
      list.sort((a, b) => {
        const reactionsA = Object.values(a.reactions).reduce((sum, current) => sum + current.length, 0);
        const reactionsB = Object.values(b.reactions).reduce((sum, current) => sum + current.length, 0);
        return (reactionsB + b.comments.length) - (reactionsA + a.comments.length);
      });
    }

    return list;
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    createPost(
      newPostContent,
      newPostCommunity || undefined,
      newPostMedia || undefined
    );

    setNewPostContent("");
    setNewPostMedia("");
    setNewPostCommunity("");
    setShowMediaInput(false);
    setCreatorExpanded(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentsPostId || !newCommentContent.trim()) return;

    addComment(activeCommentsPostId, newCommentContent);
    setNewCommentContent("");
  };

  const handleReportPost = (postId: string, content: string) => {
    flagContent("post", postId, content, "Content violates guidelines / Spam");
    alert("Post flagged for moderator review.");
  };

  const selectedPostForComments = posts.find((p) => p.id === activeCommentsPostId);

  return (
    <div className="space-y-6">
      
      {/* 1. POST CREATOR */}
      <Card className="overflow-hidden">
        <CardContent className="pt-5">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="flex items-start space-x-3.5">
              <img
                src={currentUser?.avatar}
                alt=""
                className="w-10 h-10 rounded-xl object-cover border border-border"
              />
              <div className="flex-1">
                <Textarea
                  placeholder="Share what is happening on campus or at work..."
                  value={newPostContent}
                  onChange={(e) => {
                    setNewPostContent(e.target.value);
                    setCreatorExpanded(true);
                  }}
                  className="min-h-12 border-0 bg-transparent p-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-0 focus:outline-hidden focus:bg-transparent resize-none text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Expanded fields */}
            <AnimatePresence>
              {creatorExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-3 border-t border-border/10"
                >
                  {showMediaInput && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Paste image URL here..."
                        value={newPostMedia}
                        onChange={(e) => setNewPostMedia(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-secondary/30 text-foreground border border-border/40 focus:ring-1 focus:ring-primary focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewPostMedia("");
                          setShowMediaInput(false);
                        }}
                        className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMediaInput(true)}
                        className="flex items-center gap-1.5 border-border/40 bg-secondary/15 rounded-xl hover:bg-secondary/40"
                      >
                        <Image className="h-4 w-4 text-violet-400" />
                        <span className="text-[11px] font-bold">Add Photo</span>
                      </Button>

                      {/* Community selector */}
                      <select
                        value={newPostCommunity}
                        onChange={(e) => setNewPostCommunity(e.target.value)}
                        className="text-[11px] font-bold border border-border/40 bg-secondary/15 rounded-xl px-2.5 py-1.5 focus:outline-hidden text-foreground"
                      >
                        <option value="">Global Feed</option>
                        {communities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCreatorExpanded(false)}
                        className="rounded-xl border-0 text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={!newPostContent.trim()}
                        className="rounded-xl px-4 py-1.5 font-bold shadow-md shadow-primary/20 flex items-center gap-1.5"
                      >
                        Post Thread <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>

      {/* 2. TAB CONTROLLER */}
      <div className="flex items-center justify-between border-b border-border/20">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "all" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "trending" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Trending 🔥
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "bookmarks" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Bookmarks 🔖
          </button>
        </div>
      </div>

      {/* 3. POST LIST */}
      <div className="space-y-4">
        {getFilteredPosts().length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-base font-bold text-foreground">No posts found</p>
            <p className="text-xs text-muted-foreground">Be the first to post a thread in the workspace!</p>
          </div>
        ) : (
          getFilteredPosts().map((post) => {
            const author = users.find((u) => u.id === post.authorId);
            const comm = communities.find((c) => c.id === post.communityId);
            const isBookmarked = post.bookmarks.includes(currentUser?.id || "");
            
            return (
              <Card key={post.id} hoverEffect className="relative">
                {post.pinned && (
                  <div className="absolute top-4 right-4 text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Pinned
                  </div>
                )}
                
                {/* Post Header */}
                <CardHeader className="flex flex-row items-center space-x-3.5 space-y-0 pb-3">
                  <img
                    src={author?.avatar}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-1">
                      <p className="text-xs font-bold text-foreground flex items-center gap-0.5">
                        {author?.name}
                        {author?.verificationStatus === "verified" && (
                          <span className="text-[10px] text-emerald-400">🛡️</span>
                        )}
                      </p>
                      {comm && (
                        <>
                          <span className="text-muted-foreground text-[10px]">in</span>
                          <span className="px-1.5 py-0.5 rounded-md bg-secondary/80 text-muted-foreground font-black text-[9px] border border-border/30">
                            {comm.logo} {comm.name}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold">
                      {author?.title} • {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </CardHeader>

                {/* Post Content */}
                <CardContent className="space-y-4">
                  <p className="text-xs md:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                  {post.media && post.media.length > 0 && (
                    <div className="rounded-2xl border border-border/30 overflow-hidden bg-secondary/10 max-h-80 flex items-center justify-center">
                      <img
                        src={post.media[0].url}
                        alt="Post media scan"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </CardContent>

                {/* Post Footer Actions */}
                <CardFooter className="flex items-center justify-between border-t border-border/10 pt-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    {/* Reactions triggers */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => reactToPost(post.id, "🔥")}
                        className={`flex items-center gap-1 p-1.5 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors cursor-pointer ${
                          post.reactions["🔥"]?.includes(currentUser?.id || "") ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : ""
                        }`}
                      >
                        <Flame className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold">{post.reactions["🔥"]?.length || 0}</span>
                      </button>
                      
                      <button
                        onClick={() => reactToPost(post.id, "❤️")}
                        className={`flex items-center gap-1 p-1.5 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors cursor-pointer ${
                          post.reactions["❤️"]?.includes(currentUser?.id || "") ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : ""
                        }`}
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold">{post.reactions["❤️"]?.length || 0}</span>
                      </button>

                      <button
                        onClick={() => reactToPost(post.id, "👍")}
                        className={`flex items-center gap-1 p-1.5 rounded-xl border border-border/30 hover:bg-secondary/40 transition-colors cursor-pointer ${
                          post.reactions["👍"]?.includes(currentUser?.id || "") ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : ""
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold">{post.reactions["👍"]?.length || 0}</span>
                      </button>
                    </div>

                    {/* Comments toggle drawer */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveCommentsPostId(post.id)}
                      className="flex items-center gap-1 text-[11px] rounded-xl hover:bg-secondary/40 border-0"
                    >
                      <MessageCircle className="h-4 w-4 text-indigo-400" />
                      <span>{post.comments.length} Comments</span>
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(post.id)}
                      className={`!p-2 rounded-full border-0 ${isBookmarked ? "text-amber-500" : ""}`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReportPost(post.id, post.content)}
                      className="!p-2 rounded-full text-muted-foreground hover:text-destructive border-0"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* 4. COMMENTS SLIDING DRAWER */}
      <Drawer
        isOpen={activeCommentsPostId !== null}
        onClose={() => setActiveCommentsPostId(null)}
        title="Post Conversation Threads"
      >
        {selectedPostForComments && (
          <div className="flex flex-col h-[75vh] space-y-4">
            {/* Opener Post Snippet */}
            <div className="p-3 bg-secondary/35 rounded-2xl border border-border/20">
              <p className="text-xs text-foreground font-semibold leading-relaxed">
                {selectedPostForComments.content}
              </p>
            </div>

            {/* List of comments */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">
                Comments ({selectedPostForComments.comments.length})
              </p>
              {selectedPostForComments.comments.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No comments yet. Write a response below!</p>
              ) : (
                selectedPostForComments.comments.map((comm) => {
                  const commAuthor = users.find((u) => u.id === comm.authorId);
                  return (
                    <div key={comm.id} className="p-3 rounded-2xl bg-secondary/15 border border-border/10 space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <img src={commAuthor?.avatar} alt="" className="w-5.5 h-5.5 rounded-md object-cover" />
                        <div>
                          <p className="text-[11px] font-bold text-foreground flex items-center gap-0.5">
                            {commAuthor?.name}
                            {commAuthor?.verificationStatus === "verified" && (
                              <span className="text-[10px] text-emerald-400">🛡️</span>
                            )}
                          </p>
                          <p className="text-[8px] text-muted-foreground">
                            {new Date(comm.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/90 pl-1.5 leading-relaxed">{comm.content}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Form input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 border-t border-border/20 pt-4 mt-auto">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-secondary/75 text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:ring-1 focus:ring-primary"
                required
              />
              <Button variant="primary" className="shadow-md shadow-primary/10" type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </Drawer>

    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading feed updates...</div>}>
      <FeedContent />
    </Suspense>
  );
}
