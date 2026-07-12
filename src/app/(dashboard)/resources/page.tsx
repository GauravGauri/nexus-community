"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { FileText, Download, Play, Link as LinkIcon, Search, Plus, Check, BookOpen } from "lucide-react";

export default function ResourcesPage() {
  const { resources, postResource, currentUser } = useStore();
  
  // States
  const [filterCategory, setFilterCategory] = useState<"All" | "Slides" | "Document" | "Video" | "Link">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Slides" | "Document" | "Video" | "Link">("Document");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState("");

  const handlePostResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !url.trim()) return;

    const tags = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    postResource({
      title,
      category,
      url,
      description,
      department: department || currentUser?.department || "General",
      tags,
    });

    // Reset Form & Close
    setTitle("");
    setUrl("");
    setDescription("");
    setDepartment("");
    setSkills("");
    setIsModalOpen(false);
  };

  const handleDownload = (resId: string) => {
    if (downloadedIds.includes(resId)) return;
    setDownloadedIds((prev) => [...prev, resId]);

    // Update downloadsCount reactively in store
    const { resources: currentResources } = useStore.getState();
    const updated = currentResources.map((r) => {
      if (r.id === resId) {
        return { ...r, downloadsCount: r.downloadsCount + 1 };
      }
      return r;
    });
    useStore.setState({ resources: updated });
    
    // Save to localStorage
    const currentDb = localStorage.getItem("nexus_community_db");
    if (currentDb) {
      const parsed = JSON.parse(currentDb);
      parsed.resources = updated;
      localStorage.setItem("nexus_community_db", JSON.stringify(parsed));
    }
  };

  // Filter Resources
  const filteredResources = resources.filter((r) => {
    const matchesCategory = filterCategory === "All" || r.category === filterCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs uppercase font-bold tracking-widest text-primary/80">Asset Repository</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">Resource Library</h1>
          <p className="text-xs text-muted-foreground">Download lecture slides, research documentation, video workshops, or cheat sheets.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Share Resource
        </Button>
      </div>

      {/* 2. SEARCH & FILTERS */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by topic, department, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-secondary/55 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:bg-background focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-secondary/40 border border-border/40 p-1 rounded-xl w-full md:w-auto justify-around overflow-x-auto">
            {(["All", "Slides", "Document", "Video", "Link"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat
                    ? "bg-card text-foreground shadow-xs border border-border/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. RESOURCES GRID */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 space-y-3 border border-dashed border-border/30 rounded-2xl">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">No matches found</p>
          <p className="text-xs text-muted-foreground">Try modifying your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const hasDownloaded = downloadedIds.includes(res.id);
            return (
              <Card key={res.id} hoverEffect className="flex flex-col justify-between h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      {res.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-semibold">{res.downloadsCount} downloads</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground leading-snug">{res.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {res.description}
                  </p>
                  
                  {/* Department & tag meta */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold">
                      <span>Department: {res.department}</span>
                      <span>Shared {new Date(res.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {res.tags.map((t) => (
                        <span key={t} className="text-[8px] font-semibold text-zinc-400 bg-secondary/50 border border-border/10 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleDownload(res.id)}
                    className="block pt-2"
                  >
                    <Button
                      variant={hasDownloaded ? "outline" : "secondary"}
                      size="sm"
                      className="w-full text-xs py-1.5 flex items-center justify-center gap-1.5"
                    >
                      {res.category === "Video" ? (
                        <>
                          <Play className="h-4 w-4" /> Watch Lesson
                        </>
                      ) : res.category === "Link" ? (
                        <>
                          <LinkIcon className="h-4 w-4" /> Go to Link
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" /> {hasDownloaded ? "Download Again" : "Download File"}
                        </>
                      )}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. SHARE RESOURCE DIALOG */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Share Resource Asset">
        <form onSubmit={handlePostResource} className="space-y-4 text-xs font-semibold">
          <Input
            label="Resource Asset Name"
            placeholder="e.g. Next.js 15 Cheat Sheet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Asset Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground focus:outline-hidden border-border/40 focus:ring-1 focus:ring-primary focus:border-primary font-medium"
              >
                <option value="Document">Document PDF/Doc</option>
                <option value="Slides">Syllabus Slides</option>
                <option value="Video">Video Lesson</option>
                <option value="Link">External Link</option>
              </select>
            </div>

            <Input
              label="Associated Department / Group"
              placeholder="e.g. Computer Science (CSE)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <Input
            label="Asset Download/Reference URL"
            placeholder="e.g. https://drive.google.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Input
            label="Topics & Tags (Comma separated)"
            placeholder="e.g. nextjs-15, cheat-sheet, midterms"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <Textarea
            label="Asset Description"
            placeholder="Describe what is covered in this asset, guidelines, and lecture context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Asset
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
