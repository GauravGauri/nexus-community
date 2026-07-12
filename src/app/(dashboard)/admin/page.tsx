"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsAreaChart, AnalyticsBarChart } from "@/components/ui/charts";
import { Settings, ShieldCheck, XCircle, ArrowUpRight, TrendingUp, Users, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { users, approveVerification, rejectVerification } = useStore();

  // Filter pending verifications
  const pendingUsers = users.filter((u) => u.verificationStatus === "pending");

  // Mock data for graphs
  const signupData = [
    { name: "Mon", Users: 24 },
    { name: "Tue", Users: 32 },
    { name: "Wed", Users: 45 },
    { name: "Thu", Users: 58 },
    { name: "Fri", Users: 72 },
    { name: "Sat", Users: 89 },
    { name: "Sun", Users: 104 },
  ];

  const postData = [
    { name: "Mon", Posts: 12 },
    { name: "Tue", Posts: 19 },
    { name: "Wed", Posts: 34 },
    { name: "Thu", Posts: 28 },
    { name: "Fri", Posts: 41 },
    { name: "Sat", Posts: 56 },
    { name: "Sun", Posts: 72 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" /> Admin Command Center
        </h2>
        <p className="text-xs text-muted-foreground">Manage global network controls, approval queues, and review server analytics.</p>
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-violet-400" /> Member Signup Analytics (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <AnalyticsAreaChart data={signupData} dataKey="Users" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b border-border/10">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-emerald-400" /> Community Contribution Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <AnalyticsBarChart data={postData} dataKey="Posts" strokeColor="var(--ring)" />
          </CardContent>
        </Card>
      </div>

      {/* Verification approvals queue */}
      <Card>
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" /> Onboarding Verification Queue ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {pendingUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Verification approval queue is currently empty.</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-2xl border border-border/40 bg-secondary/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div className="text-xs leading-relaxed">
                      <p className="font-bold text-foreground">{user.name} (@{user.username})</p>
                      <p className="text-muted-foreground">{user.title}</p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-semibold">
                        Verification Type: <b>{user.verificationDetails?.type}</b> (Value: <i>{user.verificationDetails?.value}</i>)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectVerification(user.id)}
                      className="flex-1 md:flex-none border-destructive/20 text-destructive hover:bg-destructive/10 text-xs font-bold rounded-xl"
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => approveVerification(user.id)}
                      className="flex-1 md:flex-none flex items-center justify-center text-xs font-bold rounded-xl"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1" /> Approve Member
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
