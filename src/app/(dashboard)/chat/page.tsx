"use client";

import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  MessageSquare,
  Hash,
  Paperclip,
  Send,
  Plus,
  Compass,
  Users,
  Circle,
  FileText,
  Image as ImageIcon,
  Smile,
  X
} from "lucide-react";

export default function ChatPage() {
  const {
    currentUser,
    users,
    chatThreads,
    chatMessages,
    sendChatMessage,
    startDM,
    activeThreadId,
    setActiveThread
  } = useStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Selection/DM Start states
  const [newDmOpen, setNewDmOpen] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  
  // Attached files states
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: "image" | "file" } | null>(null);

  // Auto-scroll messages list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeThreadId]);

  // Find active thread details
  const activeThread = chatThreads.find((t) => t.id === activeThreadId);
  
  // Filter messages belonging to this thread
  const activeMessages = chatMessages.filter((m) => m.threadId === activeThreadId);

  // Get recipient for DMs
  const getRecipient = (thread: typeof chatThreads[0]) => {
    const otherId = thread.members.find((id) => id !== currentUser?.id);
    return users.find((u) => u.id === otherId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() && !attachedFile) return;

    const mediaPayload = attachedFile
      ? [
          {
            type: attachedFile.type,
            url:
              attachedFile.type === "image"
                ? "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300"
                : "",
            name: attachedFile.name,
            size: attachedFile.size,
          },
        ]
      : undefined;

    sendChatMessage(typedMessage, mediaPayload);
    
    // reset
    setTypedMessage("");
    setAttachedFile(null);
  };

  const handleStartDMUser = (targetUserId: string) => {
    startDM(targetUserId);
    setNewDmOpen(false);
  };

  // Mock File selection trigger
  const handleSelectMockAttachment = (type: "image" | "file") => {
    if (type === "image") {
      setAttachedFile({ name: "mockup_dashboard_v2.png", size: "1.4 MB", type: "image" });
    } else {
      setAttachedFile({ name: "requirements_doc.pdf", size: "450 KB", type: "file" });
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] border border-border/40 rounded-3xl overflow-hidden bg-card flex">
      
      {/* 1. CHAT SIDEBAR */}
      <div className="w-64 border-r border-border/30 bg-secondary/15 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/20 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Channels & Chat</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNewDmOpen(true)}
            className="!p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/40 border-0"
            title="Start Direct Message"
          >
            <Plus className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Scroll channels list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Channels list */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Public Channels</p>
            {chatThreads
              .filter((t) => t.type === "channel")
              .map((chan) => {
                const active = chan.id === activeThreadId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveThread(chan.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/35"
                    }`}
                  >
                    <Hash className="h-4 w-4" />
                    <span>{chan.name}</span>
                  </button>
                );
              })}
          </div>

          {/* DMs list */}
          <div className="space-y-0.5">
            <p className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1">Direct Messages</p>
            {chatThreads
              .filter((t) => t.type === "dm")
              .map((dm) => {
                const active = dm.id === activeThreadId;
                const recipient = getRecipient(dm);
                if (!recipient) return null;
                
                return (
                  <button
                    key={dm.id}
                    onClick={() => setActiveThread(dm.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/35"
                    }`}
                  >
                    <div className="relative">
                      <img src={recipient.avatar} alt="" className="w-5 h-5 rounded-md object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-card" />
                    </div>
                    <span className="truncate">{recipient.name}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* 2. MESSAGES MODULE AREA */}
      <div className="flex-1 flex flex-col bg-background/20 relative">
        {activeThread ? (
          <>
            {/* Active chat header */}
            <div className="h-14 border-b border-border/20 px-6 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {activeThread.type === "channel" ? (
                  <>
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">#{activeThread.name}</h4>
                      <p className="text-[9px] text-muted-foreground">General workspace announcements and discussions</p>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={getRecipient(activeThread)?.avatar}
                      alt=""
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{getRecipient(activeThread)?.name}</h4>
                      <p className="text-[9px] text-muted-foreground flex items-center gap-1.5">
                        <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500" />
                        Online • {getRecipient(activeThread)?.title}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Scroll messages logs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map((msg) => {
                const sender = users.find((u) => u.id === msg.senderId);
                const isCurrentUser = msg.senderId === currentUser?.id;
                
                return (
                  <div key={msg.id} className={`flex items-start space-x-3 max-w-[80%] ${isCurrentUser ? "ml-auto flex-row-reverse space-x-reverse" : ""}`}>
                    <img
                      src={sender?.avatar}
                      alt=""
                      className="w-7 h-7 rounded-lg object-cover border border-border mt-0.5"
                    />
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 text-[10px] ${isCurrentUser ? "justify-end" : ""}`}>
                        <span className="font-bold text-foreground">{sender?.name}</span>
                        <span className="text-zinc-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                        isCurrentUser
                          ? "bg-primary border-primary/20 text-primary-foreground rounded-tr-none"
                          : "bg-secondary/40 border-border/20 text-foreground rounded-tl-none"
                      }`}>
                        <p>{msg.content}</p>

                        {/* Attached media display */}
                        {msg.media && msg.media.length > 0 && (
                          <div className="mt-2.5 p-2 rounded-xl bg-black/10 border border-white/5 flex items-center space-x-3.5">
                            {msg.media[0].type === "image" ? (
                              <>
                                <ImageIcon className="h-8 w-8 text-violet-400" />
                                <div className="text-[10px] min-w-0">
                                  <p className="font-semibold truncate text-white">{msg.media[0].name}</p>
                                  <p className="text-zinc-400">{msg.media[0].size}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <FileText className="h-8 w-8 text-blue-400" />
                                <div className="text-[10px] min-w-0">
                                  <p className="font-semibold truncate text-white">{msg.media[0].name}</p>
                                  <p className="text-zinc-400">{msg.media[0].size}</p>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/20 bg-secondary/10">
              {attachedFile && (
                <div className="mb-2 p-2 rounded-xl bg-secondary border border-border/40 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    {attachedFile.type === "image" ? (
                      <ImageIcon className="h-4 w-4 text-violet-400" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-400" />
                    )}
                    <span className="font-semibold truncate max-w-xs">{attachedFile.name} ({attachedFile.size})</span>
                  </div>
                  <button type="button" onClick={() => setAttachedFile(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {/* File Attachment Dropdown */}
                <div className="relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="!p-2 rounded-xl text-muted-foreground hover:text-foreground border-0"
                  >
                    <Paperclip className="h-4.5 w-4.5" />
                  </Button>
                  
                  {/* Floating Action Menu */}
                  <div className="hidden group-hover:block absolute bottom-10 left-0 bg-card border border-border/50 rounded-xl p-1 shadow-2xl z-50 w-40 glass">
                    <button
                      type="button"
                      onClick={() => handleSelectMockAttachment("image")}
                      className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg flex items-center space-x-2"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-violet-400" />
                      <span>Attach Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMockAttachment("file")}
                      className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg flex items-center space-x-2"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                      <span>Attach PDF</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-secondary/65 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:ring-1 focus:ring-primary"
                />

                <Button
                  variant="primary"
                  className="shadow-md shadow-primary/10 rounded-xl"
                  type="submit"
                  disabled={!typedMessage.trim() && !attachedFile}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-45" />
            <h4 className="text-base font-bold text-foreground">No Chat Active</h4>
            <p className="text-xs text-muted-foreground max-w-xs">Select a channel or start a direct message with a workspace colleague.</p>
            <Button variant="primary" size="sm" onClick={() => setNewDmOpen(true)}>Start Messaging</Button>
          </div>
        )}
      </div>

      {/* 3. NEW DM DIALOG */}
      <Dialog isOpen={newDmOpen} onClose={() => setNewDmOpen(false)} title="Start a Conversation">
        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Community Member</p>
          {users
            .filter((u) => u.id !== currentUser?.id)
            .map((user) => (
              <button
                key={user.id}
                onClick={() => handleStartDMUser(user.id)}
                className="w-full p-2.5 flex items-center space-x-3 rounded-xl border border-border/20 bg-secondary/15 hover:bg-secondary/40 text-left transition-colors cursor-pointer"
              >
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground flex items-center gap-1">
                    {user.name}
                    {user.verificationStatus === "verified" && <span className="text-[9px] text-emerald-400">🛡️</span>}
                  </p>
                  <p className="text-[9px] text-muted-foreground truncate">{user.title}</p>
                </div>
              </button>
            ))}
        </div>
      </Dialog>

    </div>
  );
}
