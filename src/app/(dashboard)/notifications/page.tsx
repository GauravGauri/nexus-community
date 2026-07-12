"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Bell, Check, Trash2, Mail, MessageSquare, Award, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredNotifications = () => {
    let list = [...notifications];

    if (activeTab === "unread") {
      list = list.filter((n) => !n.read);
    } else if (activeTab === "mentions") {
      list = list.filter((n) => n.type === "mention");
    } else if (activeTab === "system") {
      list = list.filter((n) => n.type === "system");
    }

    return list;
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    
    // Navigate dynamically
    if (notif.type === "chat") {
      router.push("/chat");
    } else if (notif.type === "comment" || notif.type === "like") {
      router.push("/feed");
    } else if (notif.type === "reputation") {
      router.push("/qa");
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="h-4.5 w-4.5 text-cyan-400" />;
      case "mention":
        return <Mail className="h-4.5 w-4.5 text-violet-400" />;
      case "reputation":
        return <Award className="h-4.5 w-4.5 text-amber-500" />;
      default:
        return <AlertCircle className="h-4.5 w-4.5 text-indigo-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-violet-400" /> Notification Center
          </h2>
          <p className="text-xs text-muted-foreground">Review alerts and community activity logs.</p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 rounded-xl border-border/40 text-xs font-bold"
          >
            <Check className="h-4 w-4 text-emerald-400" /> Mark all as read
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "all", label: "All Alerts" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "mentions", label: "Mentions" },
          { id: "system", label: "System Updates" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
        className="max-w-md"
      />

      {/* List */}
      <div className="space-y-3">
        {getFilteredNotifications().length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No alerts match your filter criteria.</p>
          </div>
        ) : (
          getFilteredNotifications().map((notif) => (
            <Card
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition-all duration-200 cursor-pointer border-border/40 flex items-start space-x-3.5 ${
                !notif.read ? "bg-primary/5 hover:bg-primary/10 border-primary/10" : "hover:bg-secondary/40"
              }`}
            >
              <div className="p-2 bg-secondary/80 rounded-xl mt-0.5 border border-border/20 shrink-0">
                {getNotifIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-foreground truncate">{notif.title}</p>
                  {!notif.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground leading-normal">{notif.content}</p>
                <p className="text-[9px] text-zinc-500 font-semibold pt-1">
                  {new Date(notif.createdAt).toLocaleDateString()} at{" "}
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
