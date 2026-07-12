"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Calendar, Plus, MapPin, Video, CheckCircle2, Users, Search } from "lucide-react";

function EventsContent() {
  const searchParams = useSearchParams();
  const { currentUser, events, registerForEvent, createEvent, users } = useStore();
  
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Create Event Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [meetingLink, setMeetingLink] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Check if routed with "?action=create"
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setCreateOpen(true);
    }
  }, [searchParams]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !time || !location) return;

    createEvent({
      title,
      description,
      date,
      time,
      location,
      isOnline,
      meetingLink: isOnline ? meetingLink : undefined,
      coverImage: coverImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    });

    // reset
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setIsOnline(true);
    setMeetingLink("");
    setCoverImage("");
    setCreateOpen(false);
  };

  const getFilteredEvents = () => {
    let list = [...events];

    if (activeTab === "registered") {
      list = list.filter((e) => e.registeredUsers.includes(currentUser?.id || ""));
    }

    if (search.trim()) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-violet-400" /> Organization Events
          </h2>
          <p className="text-xs text-muted-foreground">Register for hackathons, workshops, and social meetups.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 self-start md:self-auto rounded-xl shadow-md shadow-primary/10"
        >
          <Plus className="h-4.5 w-4.5" /> Create Event
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-primary border-primary text-white"
                : "border-border/40 bg-secondary/15 text-muted-foreground hover:text-foreground"
            }`}
          >
            Explore All
          </button>
          <button
            onClick={() => setActiveTab("registered")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeTab === "registered"
                ? "bg-primary border-primary text-white"
                : "border-border/40 bg-secondary/15 text-muted-foreground hover:text-foreground"
            }`}
          >
            My RSVPs ({events.filter((e) => e.registeredUsers.includes(currentUser?.id || "")).length})
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-secondary/45 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:bg-background focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getFilteredEvents().length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-muted-foreground">No events match your criteria.</p>
          </div>
        ) : (
          getFilteredEvents().map((ev) => {
            const hasRsvp = ev.registeredUsers.includes(currentUser?.id || "");
            
            return (
              <Card key={ev.id} hoverEffect className="overflow-hidden flex flex-col h-full border-border/40">
                {/* Event Cover Image */}
                <div className="h-44 w-full relative">
                  <img src={ev.coverImage} alt={ev.title} className="object-cover w-full h-full" />
                  <div className="absolute top-4 left-4 p-2 bg-card rounded-xl text-center font-bold text-xs min-w-12 border border-border/20 glass">
                    <p className="uppercase text-[9px] text-primary font-black">{ev.date.split("-")[1]}</p>
                    <p className="text-base font-extrabold leading-none">{ev.date.split("-")[2]}</p>
                  </div>
                </div>

                {/* Event Details Content */}
                <CardContent className="pt-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-foreground leading-snug">{ev.title}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/10">
                    <div className="flex items-center text-[10px] text-muted-foreground gap-2 font-semibold">
                      {ev.isOnline ? (
                        <>
                          <Video className="h-4 w-4 text-violet-400 shrink-0" />
                          <span className="truncate">Online ({ev.location})</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-[10px] font-bold text-muted-foreground">{ev.registeredUsers.length} attending</span>
                      </div>
                      
                      <Button
                        variant={hasRsvp ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => registerForEvent(ev.id)}
                        className="rounded-xl text-[10px] font-bold py-1.5"
                      >
                        {hasRsvp ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Registered
                          </span>
                        ) : (
                          "RSVP Register"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* CREATE MODAL */}
      <Dialog isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create a Workspace Event">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. AI Builder Hackathon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="Detail event criteria, schedules, prerequisites, guest lists..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-4 p-2.5 bg-secondary/15 rounded-xl border border-border/20 text-xs font-semibold">
            <span>Location setup:</span>
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="isOnline"
                checked={isOnline}
                onChange={() => setIsOnline(true)}
                className="accent-primary"
              />
              <span>Online Session</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="isOnline"
                checked={!isOnline}
                onChange={() => setIsOnline(false)}
                className="accent-primary"
              />
              <span>On-Campus / Site</span>
            </label>
          </div>

          <Input
            label={isOnline ? "Meeting Link" : "Venue Address"}
            placeholder={isOnline ? "e.g. https://meet.google.com/abc-def" : "e.g. Science Library Room 402"}
            value={isOnline ? meetingLink : location}
            onChange={(e) => (isOnline ? setMeetingLink(e.target.value) : setLocation(e.target.value))}
            required
          />

          {!isOnline && (
            <Input
              label="Online coordinates (Fallback)"
              placeholder="e.g. Zoom link or coordinates"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          )}

          <Input
            label="Cover Image URL"
            placeholder="Paste unsplash link or image URL..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
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
              disabled={!title.trim() || !description.trim() || !date || !time}
            >
              Post Event
            </Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading events calendar...</div>}>
      <EventsContent />
    </Suspense>
  );
}
