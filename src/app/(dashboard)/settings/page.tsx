"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ShieldCheck, User, Bell, ShieldAlert, Check } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function SettingsPage() {
  const { currentUser, updateProfile } = useStore();
  const { theme, setTheme } = useTheme();

  // Profile Form States
  const [name, setName] = useState(currentUser?.name || "");
  const [title, setTitle] = useState(currentUser?.title || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  
  // Notification States
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, title, bio, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          User Settings
        </h2>
        <p className="text-xs text-muted-foreground">Manage profile, notification channels, and verification details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column Settings choices */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-3 text-xs space-y-1">
              <button className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-left">
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Settings Form content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile details editor */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Public Profile Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="flex items-center space-x-4 pb-2">
                  <img src={avatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-border" />
                  <Input
                    label="Avatar URL"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Headline / Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <Textarea
                  label="Biography"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  {saved && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-4 w-4" /> Profile details saved
                    </span>
                  )}
                  <Button variant="primary" type="submit" className="ml-auto">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Theme switching preferences */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Interface Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Select Display Mode</p>
                <p className="text-muted-foreground mt-0.5">Toggle between dark aesthetic or standard light interface</p>
              </div>
              <div className="flex bg-secondary p-1 rounded-xl border border-border/30">
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                    theme === "dark" ? "bg-card text-white shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all ${
                    theme === "light" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Light
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Verification credentials status */}
          <Card>
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Verification Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 text-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-foreground flex items-center gap-1">
                    Status:{" "}
                    {currentUser?.verificationStatus === "verified" ? (
                      <span className="text-emerald-400 font-black">Verified Shield Active</span>
                    ) : currentUser?.verificationStatus === "pending" ? (
                      <span className="text-amber-500 font-black">Verification Pending</span>
                    ) : (
                      <span className="text-destructive font-black">Unverified Guest</span>
                    )}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-1">
                    {currentUser?.verificationStatus === "verified"
                      ? `Your account is associated with verified network domain: ${currentUser?.org?.domain}.`
                      : "Upload student credentials or corporate invite codes to access group channels."}
                  </p>
                </div>
                
                {currentUser?.verificationStatus === "verified" ? (
                  <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                ) : (
                  <Link href="/verify-org" className="shrink-0">
                    <Button variant="primary" size="sm">Verify Now</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
