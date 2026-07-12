"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Sparkles
} from "lucide-react";

// Inline Custom SVG Social Icons
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Organization presets
const ORG_TYPES = [
  { id: "university", label: "University", icon: GraduationCap, desc: "Higher education university campus" },
  { id: "college", label: "College", icon: GraduationCap, desc: "Undergrad, postgrad, or vocational college" },
  { id: "company", label: "Company", icon: Building2, desc: "Corporate enterprise or workplace" },
  { id: "school", label: "School", icon: GraduationCap, desc: "High school, academy, or primary school" },
  { id: "startup", label: "Startup", icon: Sparkles, desc: "Early-stage or high-growth tech startup" },
  { id: "government", label: "Government Org", icon: Building2, desc: "Public sector, department or administration" },
];

// Department listings based on Org Type
const DEPARTMENTS_BY_ORG: Record<string, string[]> = {
  university: [
    "Computer Science (CSE)",
    "Information Technology",
    "Artificial Intelligence",
    "Data Science",
    "Cyber Security",
    "Electronics Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Biotechnology",
    "MBA (Management)",
    "BBA (Management)",
    "Finance & Accounting",
    "Marketing & Sales",
    "Human Resources",
    "MCA (Computer Courses)",
    "BCA (Computer Courses)",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Statistics",
    "Biology",
    "B.Com",
    "M.Com",
    "English",
    "History",
    "Political Science",
    "Psychology",
    "Sociology",
    "MBBS (Medical)",
    "BDS (Medical)",
    "Nursing",
    "Pharmacy",
    "LLB (Law)",
    "LLM (Law)",
    "Architecture",
    "Fashion Design",
    "Hotel Management"
  ],
  college: [
    "Computer Science (CSE)",
    "Information Technology",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "BBA",
    "BCA",
    "MCA",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Commerce",
    "Arts",
    "Pharmacy",
    "Law"
  ],
  school: [
    "Primary School",
    "Middle School",
    "High School (PCM - Physics, Chemistry, Math)",
    "High School (PCB - Physics, Chemistry, Biology)",
    "High School (Commerce)",
    "High School (Arts)",
    "General stream",
    "Sports Club",
    "Music & Arts Club",
    "Dance Club",
    "NCC / Scouts",
    "Science Club",
    "Robotics Club",
    "Coding Club",
    "Photography Club",
    "Debate Club"
  ],
  company: [
    "Engineering - Frontend Developer",
    "Engineering - Backend Developer",
    "Engineering - Full Stack Developer",
    "Engineering - Mobile Developer",
    "Engineering - QA Engineer",
    "Engineering - Automation QA",
    "Engineering - DevOps Engineer",
    "Engineering - Site Reliability Eng",
    "Engineering - AI Engineer",
    "Engineering - Machine Learning Eng",
    "Engineering - Data Engineer",
    "Engineering - Data Analyst",
    "Engineering - Cyber Security Eng",
    "Engineering - Cloud Engineer",
    "Engineering - UI Developer",
    "Design - UI Designer",
    "Design - UX Designer",
    "Design - Product Designer",
    "Business - Product Manager",
    "Business - Project Manager",
    "Business - Scrum Master",
    "Business - Business Analyst",
    "Operations - HR",
    "Operations - Recruiter",
    "Operations - Finance",
    "Operations - Sales",
    "Operations - Marketing",
    "Operations - Customer Support",
    "Operations - Legal",
    "Leadership - CTO",
    "Leadership - CEO",
    "Leadership - Director",
    "Leadership - Team Lead"
  ],
  startup: [
    "Engineering - Full Stack Developer",
    "Engineering - Mobile Developer",
    "Engineering - DevOps Engineer",
    "Engineering - AI Engineer",
    "Design - Product Designer",
    "Business - Product Manager",
    "Operations - HR",
    "Operations - Sales",
    "Operations - Marketing",
    "Leadership - Founder/CEO",
    "Leadership - CTO"
  ],
  government: [
    "Engineering - Information Technology",
    "Engineering - Cyber Security Eng",
    "Administration - Support",
    "Administration - Finance",
    "Administration - Operations",
    "Leadership - Director"
  ]
};

// Available interests tags grid
const INTERESTS_PRESETS = [
  "Web Development", "React", "Next.js", "Angular", "Vue", "Node.js", "Express", 
  "Java", "Python", "Go", "Rust", "Flutter", "Android", "iOS", 
  "Machine Learning", "Artificial Intelligence", "Cyber Security", "Cloud", "AWS", 
  "Azure", "Docker", "Kubernetes", "DevOps", "UI Design", "UX Design", "Figma", 
  "Photography", "Sports", "Gaming", "Music", "Dance", "Movies", "Startups", 
  "Entrepreneurship", "Competitive Programming", "Hackathons", "Research", 
  "Open Source", "Reading", "Travel", "Fitness", "Cooking", "Investing", 
  "Blockchain", "Data Science", "Robotics", "IoT", "Mathematics", "Physics", 
  "Chemistry", "Biology", "Finance", "Marketing", "HR", "Management", "Teaching", 
  "Public Speaking"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, completeOnboarding } = useStore();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Onboarding Form State
  const [orgType, setOrgType] = useState<any>(null);
  const [department, setDepartment] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Profile Completion States
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Junior");
  const [currentYearSemester, setCurrentYearSemester] = useState("1st Year / 1st Semester");
  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");
  
  // Links
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  
  // Avatar & Cover
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [coverPhoto, setCoverPhoto] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800");

  // Redirect if already completed
  useEffect(() => {
    if (currentUser?.profileCompleted) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleNext = () => {
    if (step === 1 && !orgType) {
      setError("Please select an organization type");
      return;
    }
    if (step === 2 && !department) {
      setError("Please choose your department / role");
      return;
    }
    if (step === 3 && selectedInterests.length < 3) {
      setError("Please select at least 3 interests to personalize recommendations");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
    if (error) setError("");
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    completeOnboarding({
      orgType,
      department,
      interests: selectedInterests,
      bio,
      skills: skillsArray,
      experienceLevel,
      currentYearSemester,
      location,
      website: website || undefined,
      github: github || undefined,
      linkedin: linkedin || undefined,
      portfolio: portfolio || undefined,
      avatar,
      coverPhoto,
    });

    router.push("/dashboard");
  };

  // Determine dynamic department options
  const departmentOptions = orgType ? DEPARTMENTS_BY_ORG[orgType] || [] : [];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#070709] overflow-hidden px-4 py-12 text-white">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl flex flex-col items-center space-y-6 relative z-10">
        
        {/* Progress Header */}
        <div className="w-full text-center space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            Complete Profile Setup
          </h2>
          <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-primary" : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Step {step} of 4: {step === 1 ? "Organization Type" : step === 2 ? "Department Choice" : step === 3 ? "Interests Selection" : "Complete Portfolio"}
          </p>
        </div>

        {/* Wizard Panel Container */}
        <Card className="w-full rounded-3xl border border-white/5 bg-zinc-900/60 p-6 md:p-8 shadow-2xl backdrop-blur-xl glass">
          {error && (
            <div className="mb-4 p-3.5 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl text-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: ORG SELECTION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-muted-foreground">Choose Organization Category</h3>
                  <p className="text-xs text-zinc-400">Select what type of workspace you represent.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {ORG_TYPES.map((org) => {
                    const Icon = org.icon;
                    const isSelected = orgType === org.id;
                    return (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => {
                          setOrgType(org.id);
                          setDepartment(""); // reset dependent
                          setError("");
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col space-y-2.5 ${
                          isSelected
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-violet-400"}`} />
                        <div>
                          <p className="font-bold text-sm text-white">{org.label}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{org.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: DEPARTMENT SELECT */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-muted-foreground">Select Department or Role</h3>
                  <p className="text-xs text-zinc-400">Choose your academic major or professional job scope.</p>
                </div>

                <div className="max-h-60 overflow-y-auto pr-1 space-y-2 border border-white/5 bg-black/10 rounded-2xl p-4">
                  {departmentOptions.map((opt) => {
                    const isSelected = department === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setDepartment(opt);
                          setError("");
                        }}
                        className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-transparent bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="h-4.5 w-4.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: INTERESTS GRID */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-muted-foreground">Select Interests (Minimum 3)</h3>
                  <p className="text-xs text-zinc-400">Select topics you want to follow in your customized recommendation feeds.</p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center max-h-64 overflow-y-auto p-2 border border-white/5 bg-black/10 rounded-2xl">
                  {INTERESTS_PRESETS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-white shadow-md shadow-primary/25"
                            : "border-white/5 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05]"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: PROFILE DETAIL FORM */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-muted-foreground">Complete Professional Profile</h3>
                  <p className="text-xs text-zinc-400">Set up your avatar, links, and background details.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
                  <div className="col-span-2 flex items-center space-x-3.5 pb-2">
                    <img src={avatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    <Input
                      label="Avatar Image URL"
                      placeholder="Paste picture URL..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Cover Photo URL"
                    placeholder="Paste banner image URL..."
                    value={coverPhoto}
                    onChange={(e) => setCoverPhoto(e.target.value)}
                  />

                  <Input
                    label="Location (City, Country)"
                    placeholder="e.g. London, UK"
                    leftIcon={<MapPin className="h-4 w-4" />}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />

                  {/* Dynamic Experience or Year display based on Org type */}
                  {orgType === "company" || orgType === "startup" || orgType === "government" ? (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience Level</label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground focus:outline-hidden border-border/40 focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="Junior">Junior Level</option>
                        <option value="Mid-Level">Mid Level</option>
                        <option value="Senior">Senior Level</option>
                        <option value="Lead/Director">Lead / Director</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Year / Semester</label>
                      <select
                        value={currentYearSemester}
                        onChange={(e) => setCurrentYearSemester(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border bg-background/50 text-sm text-foreground focus:outline-hidden border-border/40 focus:ring-1 focus:ring-primary focus:border-primary"
                      >
                        <option value="1st Year / 1st Semester">1st Year / 1st Semester</option>
                        <option value="1st Year / 2nd Semester">1st Year / 2nd Semester</option>
                        <option value="2nd Year / 3rd Semester">2nd Year / 3rd Semester</option>
                        <option value="2nd Year / 4th Semester">2nd Year / 4th Semester</option>
                        <option value="3rd Year / 5th Semester">3rd Year / 5th Semester</option>
                        <option value="3rd Year / 6th Semester">3rd Year / 6th Semester</option>
                        <option value="4th Year / 7th Semester">4th Year / 7th Semester</option>
                        <option value="4th Year / 8th Semester">4th Year / 8th Semester</option>
                      </select>
                    </div>
                  )}

                  <Input
                    label="Core Skills (Comma separated)"
                    placeholder="e.g. Figma, React, Python"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                  />

                  <div className="col-span-2">
                    <Textarea
                      label="Public Bio Summary"
                      placeholder="Tell the community about your research interests or project history..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-span-2 border-t border-white/5 pt-2 mt-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Professional Social Links</p>
                  </div>

                  <Input
                    label="GitHub Profile URL"
                    placeholder="github.com/username"
                    leftIcon={<GithubIcon className="h-4 w-4" />}
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />

                  <Input
                    label="LinkedIn Profile URL"
                    placeholder="linkedin.com/in/username"
                    leftIcon={<LinkedinIcon className="h-4 w-4" />}
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />

                  <Input
                    label="Personal Website"
                    placeholder="yourwebsite.com"
                    leftIcon={<LinkIcon className="h-4 w-4" />}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />

                  <Input
                    label="Portfolio Link"
                    placeholder="behance.net/username"
                    leftIcon={<LinkIcon className="h-4 w-4" />}
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-6">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-1.5 border-white/10 bg-secondary/10 hover:text-white"
              >
                <ArrowLeft className="h-4.5 w-4.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                className="flex items-center gap-1.5 shadow-md shadow-primary/20 ml-auto"
              >
                Continue <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleComplete}
                className="flex items-center gap-1.5 shadow-md shadow-primary/20 ml-auto"
              >
                Complete Setup <Check className="h-4.5 w-4.5" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
