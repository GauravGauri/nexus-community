"use client";

import React, { use, useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Search, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

interface OrgPageProps {
  params: Promise<{ id: string }>;
}

export default function OrgProfilePage({ params }: OrgPageProps) {
  const resolvedParams = use(params);
  const orgId = resolvedParams.id;
  const { orgs, users, communities } = useStore();
  const [search, setSearch] = useState("");

  const org = orgs.find((o) => o.id === orgId);

  if (!org) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground font-semibold">Organization profile not found in database.</p>
      </div>
    );
  }

  // Filter members belonging to this org
  const orgMembers = users.filter((u) => u.org?.id === org.id && u.verificationStatus === "verified");

  // Filter communities created by users in this org
  const orgComms = communities.filter((c) =>
    orgMembers.some((member) => member.id === c.createdBy)
  );

  const filteredMembers = orgMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Cover Org Title Card */}
      <Card className="overflow-hidden border-border/40 relative">
        <div className="h-28 bg-linear-to-r from-indigo-600/30 to-transparent absolute top-0 left-0 right-0" />
        <CardContent className="pt-16 px-6 relative z-10 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-5 text-center md:text-left">
          <img
            src={org.logo}
            alt=""
            className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-2xl relative"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <h2 className="text-lg font-black text-white">{org.name}</h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[8px] font-bold border border-emerald-500/20">
                VERIFIED NETWORK
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center md:justify-start gap-1">
              <Building className="h-3.5 w-3.5" /> Domain: {org.domain}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Left directory members list, Right communities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border/20">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-violet-400" /> Organization Members ({orgMembers.length})
            </h3>
            
            {/* Search directory */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-secondary/45 text-[11px] text-foreground placeholder:text-muted-foreground/60 rounded-xl border border-border/40 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMembers.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center col-span-full py-12">No verified members matched your search query.</p>
            ) : (
              filteredMembers.map((member) => (
                <Card key={member.id} hoverEffect className="p-4 flex items-center space-x-3.5">
                  <img src={member.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-0.5">
                      {member.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 fill-emerald-500/10" />
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate leading-snug">{member.title}</p>
                    <Link
                      href={`/profile/${member.id}`}
                      className="text-[9px] text-primary hover:underline font-bold mt-1 inline-flex items-center gap-0.5"
                    >
                      View Profile <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column Communities */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-border/20">
            <h3 className="text-sm font-bold text-foreground">Associated Hubs ({orgComms.length})</h3>
          </div>
          
          <div className="space-y-3">
            {orgComms.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No associated community hubs found.</p>
            ) : (
              orgComms.map((comm) => (
                <Card key={comm.id} hoverEffect className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-secondary/80">{comm.logo}</span>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none">{comm.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">{comm.memberCount} members</p>
                    </div>
                  </div>
                  <Link href="/communities">
                    <Button variant="outline" size="sm" className="text-[9px] !py-1">Visit</Button>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
