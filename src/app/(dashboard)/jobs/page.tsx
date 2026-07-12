"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Briefcase, MapPin, DollarSign, Calendar, Search, Sparkles, Plus, Check } from "lucide-react";

export default function JobsPage() {
  const { jobs, createJob, currentUser } = useStore();
  
  // States
  const [filterType, setFilterType] = useState<"All" | "Full-time" | "Internship">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState<"Full-time" | "Internship">("Full-time");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !description.trim()) return;

    const tags = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    createJob({
      title,
      company,
      location,
      salary,
      type,
      description,
      tags,
    });

    // Reset Form & Close
    setTitle("");
    setCompany("");
    setLocation("");
    setSalary("");
    setDescription("");
    setSkills("");
    setIsModalOpen(false);
  };

  const handleApply = (jobId: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs((prev) => [...prev, jobId]);
  };

  // Filter Jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesType = filterType === "All" || j.type === filterType;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs uppercase font-bold tracking-widest text-primary/80">Careers Hub</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">Opportunity Board</h1>
          <p className="text-xs text-muted-foreground">Find internship listings, startup contracts, or full-time roles.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Post a Job
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
              placeholder="Search by role, company, or skills tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-secondary/55 text-xs text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden focus:bg-background focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-secondary/40 border border-border/40 p-1 rounded-xl w-full md:w-auto justify-around">
            {(["All", "Full-time", "Internship"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === t
                    ? "bg-card text-foreground shadow-xs border border-border/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. LISTINGS GRID */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 space-y-3 border border-dashed border-border/30 rounded-2xl">
          <Briefcase className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">No matches found</p>
          <p className="text-xs text-muted-foreground">Try modifying your filters or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobs.includes(job.id);
            return (
              <Card key={job.id} hoverEffect className="relative overflow-hidden">
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                        job.type === "Internship" 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {job.type}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-foreground">{job.title}</h3>
                      <p className="text-xs text-primary font-semibold mt-0.5">{job.company}</p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 text-[10px] text-zinc-400 font-semibold pt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-zinc-500" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-zinc-500" /> {job.salary}</span>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-semibold text-zinc-400 bg-secondary/50 border border-border/10 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={hasApplied ? "outline" : "primary"}
                    size="sm"
                    className="min-w-[100px] text-xs py-1.5 cursor-pointer"
                    onClick={() => handleApply(job.id)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? (
                      <span className="flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Applied</span>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. POST JOB DIALOG */}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post Opportunity">
        <form onSubmit={handleCreateJob} className="space-y-4 text-xs font-semibold">
          <Input
            label="Job / Internship Title"
            placeholder="e.g. Frontend Developer Intern"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="e.g. Vercel Labs"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <Input
              label="Location"
              placeholder="e.g. Remote (UK) or City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Salary / Package Offer"
              placeholder="e.g. $45 / hour or $120k"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Opportunity Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground focus:outline-hidden border-border/40 focus:ring-1 focus:ring-primary focus:border-primary font-medium"
              >
                <option value="Full-time">Full-time Job</option>
                <option value="Internship">Internship Role</option>
              </select>
            </div>
          </div>

          <Input
            label="Skills & Tags (Comma separated)"
            placeholder="e.g. React, Next.js, Figma"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />

          <Textarea
            label="Job Description"
            placeholder="Outline daily duties, qualifications, and team details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Listing
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
