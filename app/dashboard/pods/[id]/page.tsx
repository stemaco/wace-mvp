"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  Target,
} from "lucide-react";
import { NotionSidebar } from "@/components/notion-sidebar";

export default function PodDetailPage() {
  const params = useParams();
  const podId = params.id as string;
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "chat" | "tasks" | "files"
  >("overview");

  const podData: Record<string, any> = {
    "1": {
      name: "Trice",
      emoji: "🚀",
      description: "Tech startup focused on innovative solutions",
      members: [
        {
          name: "John Doe",
          role: "Founder & CEO",
          status: "online",
          avatar: "JD",
        },
        { name: "Sarah Wilson", role: "CTO", status: "away", avatar: "SW" },
        {
          name: "Mike Chen",
          role: "Lead Designer",
          status: "online",
          avatar: "MC",
        },
      ],
      recentActivity: [
        {
          user: "Sarah Wilson",
          action: "completed authentication module",
          time: "2h ago",
        },
        { user: "John Doe", action: "updated Q4 roadmap", time: "4h ago" },
        {
          user: "Mike Chen",
          action: "uploaded new design mockups",
          time: "6h ago",
        },
      ],
      stats: {
        tasksCompleted: 12,
        tasksTotal: 18,
        upcomingMeetings: 2,
        recentMessages: 24,
      },
    },
    "2": {
      name: "Zyroz",
      emoji: "📊",
      description: "Marketing team focused on growth and brand development",
      members: [
        {
          name: "Alex Rodriguez",
          role: "Marketing Lead",
          status: "online",
          avatar: "AR",
        },
        {
          name: "Emma Thompson",
          role: "Content Creator",
          status: "offline",
          avatar: "ET",
        },
      ],
      recentActivity: [
        {
          user: "Alex Rodriguez",
          action: "launched new campaign",
          time: "1h ago",
        },
        {
          user: "Emma Thompson",
          action: "published blog post",
          time: "3h ago",
        },
      ],
      stats: {
        tasksCompleted: 8,
        tasksTotal: 12,
        upcomingMeetings: 1,
        recentMessages: 15,
      },
    },
    "3": {
      name: "Deeproot",
      emoji: "🌳",
      description: "Product development team building scalable solutions",
      members: [
        {
          name: "David Kim",
          role: "Product Manager",
          status: "online",
          avatar: "DK",
        },
        {
          name: "Lisa Park",
          role: "Senior Developer",
          status: "online",
          avatar: "LP",
        },
        {
          name: "Tom Brown",
          role: "QA Engineer",
          status: "away",
          avatar: "TB",
        },
      ],
      recentActivity: [
        { user: "Lisa Park", action: "fixed critical bug", time: "30m ago" },
        { user: "David Kim", action: "created new sprint", time: "2h ago" },
        { user: "Tom Brown", action: "completed testing", time: "5h ago" },
      ],
      stats: {
        tasksCompleted: 15,
        tasksTotal: 20,
        upcomingMeetings: 3,
        recentMessages: 32,
      },
    },
  };

  const pod = podData[podId] || podData["1"];

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      <NotionSidebar />

      <div className="absolute inset-0 flex flex-col pl-[268px]">
        <div className="relative glass-card rounded-l-3xl border-l border-border/50">
          <div className="border-b border-border px-8 py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{pod.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {pod.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {pod.description}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-border px-8">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className={
                  activeTab === "overview"
                    ? "border-b-2 border-primary rounded-none"
                    : "rounded-none"
                }
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </Button>
              <Button
                variant="ghost"
                className={
                  activeTab === "chat"
                    ? "border-b-2 border-primary rounded-none"
                    : "rounded-none"
                }
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                variant="ghost"
                className={
                  activeTab === "tasks"
                    ? "border-b-2 border-primary rounded-none"
                    : "rounded-none"
                }
                onClick={() => setActiveTab("tasks")}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Tasks
              </Button>
              <Button
                variant="ghost"
                className={
                  activeTab === "files"
                    ? "border-b-2 border-primary rounded-none"
                    : "rounded-none"
                }
                onClick={() => setActiveTab("files")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Files
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="w-full px-8 py-6">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl glass-card transition-all hover:scale-[1.02] relative overflow-hidden">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Tasks
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                          {pod.stats.tasksCompleted}/{pod.stats.tasksTotal}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl glass-card transition-all hover:scale-[1.02] relative overflow-hidden">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Meetings
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                          {pod.stats.upcomingMeetings}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl glass-card transition-all hover:scale-[1.02] relative overflow-hidden">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Messages
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                          {pod.stats.recentMessages}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl glass-card transition-all hover:scale-[1.02] relative overflow-hidden">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Members
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">
                          {pod.members.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                    <div className="space-y-4">
                      {pod.members.map((member: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl glass-card transition-all hover:scale-[1.01] flex items-center justify-between relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-foreground flex-shrink-0">
                              {member.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground">
                                {member.name}
                              </div>
                              <div className="text-sm text-muted-foreground mt-0.5">
                                {member.role}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              member.status === "online"
                                ? "default"
                                : "secondary"
                            }
                            className="flex-shrink-0"
                          >
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      {pod.recentActivity.map((activity: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl glass-card transition-all hover:scale-[1.01] relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Clock className="h-4 w-4 text-primary" />
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
                              <div className="text-xs text-muted-foreground">
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "chat" && (
                <div className="h-[600px] flex flex-col glass-card rounded-2xl relative overflow-hidden">
                  <div className="flex-1 p-4 overflow-auto">
                    <div className="text-center text-muted-foreground py-8">
                      Start a conversation with your team
                    </div>
                  </div>
                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setMessage("");
                          }
                        }}
                      />
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Tasks</h2>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Task
                    </Button>
                  </div>
                  <div className="text-center text-muted-foreground py-12">
                    No tasks yet. Create your first task to get started!
                  </div>
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Files</h2>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  <div className="text-center text-muted-foreground py-12">
                    No files uploaded yet. Upload your first file to get
                    started!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
