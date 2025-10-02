"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { NotionSidebar } from "@/components/notion-sidebar";

export default function DashboardPage() {
  const [activePods] = useState([
    {
      id: 1,
      name: "Trice",
      emoji: "🚀",
      description: "Tech startup focused on innovative solutions",
      members: 3,
      lastActivity: "2 hours ago",
      recentUpdates: 5,
    },
    {
      id: 2,
      name: "Zyroz",
      emoji: "📊",
      description: "Marketing team focused on growth and brand development",
      members: 2,
      lastActivity: "1 day ago",
      recentUpdates: 3,
    },
    {
      id: 3,
      name: "Deeproot",
      emoji: "🌳",
      description: "Product development team building scalable solutions",
      members: 3,
      lastActivity: "3 hours ago",
      recentUpdates: 8,
    },
  ]);

  const upcomingMeetings = [
    { title: "Trice Pod Standup", time: "9:00 AM Today", attendees: 3 },
    { title: "Product Review Meeting", time: "2:00 PM Today", attendees: 3 },
    {
      title: "Client Presentation - Zyroz",
      time: "10:00 AM Tomorrow",
      attendees: 2,
    },
  ];

  const recentActivity = [
    {
      user: "Sarah Wilson",
      action: "completed authentication module",
      time: "2h ago",
      pod: "Trice",
    },
    {
      user: "Alex Rodriguez",
      action: "uploaded campaign assets",
      time: "4h ago",
      pod: "Zyroz",
    },
    {
      user: "Lisa Park",
      action: "fixed authentication bug",
      time: "5h ago",
      pod: "Deeproot",
    },
  ];

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      <NotionSidebar />

      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 overflow-auto pl-[268px]">
          <div className="relative h-full">
            <div className="absolute inset-0 glass-card rounded-l-3xl border-l border-border/50"></div>
            <div className="relative z-10 w-full px-8 py-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Good morning!
                </h1>
                <p className="text-muted-foreground">
                  Here's what's happening with your workspace today.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <Link href="/dashboard/pods/create">
                  <div className="p-5 rounded-2xl glass-card transition-all cursor-pointer hover:scale-[1.02] relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">
                          Create Pod
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          New workspace
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/explore">
                  <div className="p-5 rounded-2xl glass-card transition-all cursor-pointer hover:scale-[1.02] relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">
                          Explore Pods
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Join communities
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/shop">
                  <div className="p-5 rounded-2xl glass-card transition-all cursor-pointer hover:scale-[1.02] relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">
                          AI Shop
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Browse agents
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Pods</h2>
                    <Link href="/dashboard/pods">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {activePods.map((pod) => (
                      <Link key={pod.id} href={`/dashboard/pods/${pod.id}`}>
                        <div className="p-5 rounded-2xl glass-card transition-all cursor-pointer group hover:scale-[1.01] relative overflow-hidden">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="text-3xl flex-shrink-0">
                                {pod.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-base text-foreground">
                                    {pod.name}
                                  </h3>
                                  {pod.recentUpdates > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-2 py-0.5"
                                    >
                                      {pod.recentUpdates} new
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                  {pod.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{pod.members} members</span>
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{pod.lastActivity}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Upcoming Meetings
                    </h2>
                    <div className="space-y-4">
                      {upcomingMeetings.map((meeting, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl glass-card transition-all cursor-pointer hover:scale-[1.01] relative overflow-hidden"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-foreground mb-1">
                                {meeting.title}
                              </div>
                              <div className="text-xs text-muted-foreground mb-1">
                                {meeting.time}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{meeting.attendees} attendees</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      {recentActivity.map((activity, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl glass-card transition-all hover:scale-[1.01] relative overflow-hidden"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-foreground">
                              {activity.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm mb-1">
                                <span className="font-semibold text-foreground">
                                  {activity.user}
                                </span>{" "}
                                <span className="text-muted-foreground">
                                  {activity.action}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span>{activity.pod}</span>
                                <span>·</span>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
