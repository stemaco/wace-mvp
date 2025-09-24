import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getUserContextSummary, getRelevantMemories, storeConversationInsight } from "@/lib/ai-memory"
import { getWorkspaceData, getUpcomingMeetings, getUnreadEmails, getRecentTeamsActivity, getTodaySchedule } from "@/lib/workspace-data"
import { getUserPods, getPodActivity, getAIReplicaInteractions } from "@/lib/mcp-service"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Fake pod data for context
const fakePodData = {
  "yf80804@gmail.com": {
    pods: [
      {
        id: 1,
        name: "Trice",
        type: "private",
        members: [
          { name: "John Doe", role: "Founder", email: "john@trice.com" },
          { name: "Sarah Wilson", role: "CTO", email: "sarah@trice.com" },
          { name: "Mike Chen", role: "Designer", email: "mike@trice.com" }
        ],
        recentActivity: [
          "Discussed Q4 product roadmap",
          "Reviewed new feature specifications",
          "Scheduled team meeting for next week"
        ],
        aiReplicas: [
          { name: "John's AI", personality: "Strategic, visionary, focuses on big picture" },
          { name: "Sarah's AI", personality: "Technical, detail-oriented, problem solver" },
          { name: "Mike's AI", personality: "Creative, user-focused, design thinking" }
        ]
      },
      {
        id: 2,
        name: "Zyroz",
        type: "private",
        members: [
          { name: "Alex Rodriguez", role: "Marketing Lead", email: "alex@zyroz.com" },
          { name: "Emma Thompson", role: "Content Creator", email: "emma@zyroz.com" }
        ],
        recentActivity: [
          "Launched new marketing campaign",
          "Analyzed social media metrics",
          "Planned content calendar for next month"
        ],
        aiReplicas: [
          { name: "Alex's AI", personality: "Data-driven, analytical, growth-focused" },
          { name: "Emma's AI", personality: "Creative, storytelling, brand-focused" }
        ]
      },
      {
        id: 3,
        name: "Deeproot",
        type: "public",
        members: [
          { name: "David Kim", role: "Product Manager", email: "david@deeproot.com" },
          { name: "Lisa Park", role: "Developer", email: "lisa@deeproot.com" },
          { name: "Tom Brown", role: "QA Engineer", email: "tom@deeproot.com" }
        ],
        recentActivity: [
          "Completed sprint 23",
          "Fixed critical bug in authentication",
          "Deployed new version to staging"
        ],
        aiReplicas: [
          { name: "David's AI", personality: "Organized, process-oriented, team-focused" },
          { name: "Lisa's AI", personality: "Technical, efficient, solution-oriented" },
          { name: "Tom's AI", personality: "Thorough, quality-focused, detail-oriented" }
        ]
      }
    ],
    userProfile: {
      name: "YF808",
      email: "yf80804@gmail.com",
      role: "Premium User",
      joinDate: "2024-01-15",
      preferences: {
        notifications: true,
        theme: "dark",
        language: "en"
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, userEmail, conversationHistory, webSearchResults } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    // Get user's pod data
    const userData = fakePodData[userEmail as keyof typeof fakePodData]
    
    if (!userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      )
    }

    // Get relevant memories and context
    const relevantMemories = getRelevantMemories(userEmail, message)
    const userContext = getUserContextSummary(userEmail)
    
    // Get workspace data
    const workspaceData = getWorkspaceData(userEmail)
    const upcomingMeetings = getUpcomingMeetings(userEmail, 24)
    const unreadEmails = getUnreadEmails(userEmail)
    const recentTeamsActivity = getRecentTeamsActivity(userEmail, 24)
    const todaySchedule = getTodaySchedule(userEmail)

    // Create context from user's pods and workspace data
    const context = `
User Profile:
- Name: ${userData.userProfile.name}
- Email: ${userData.userProfile.email}
- Role: ${userData.userProfile.role}
- Join Date: ${userData.userProfile.joinDate}

User's Pods:
${userData.pods.map(pod => `
Pod: ${pod.name} (${pod.type})
Members: ${pod.members.map(m => `${m.name} (${m.role})`).join(", ")}
Recent Activity: ${pod.recentActivity.join(", ")}
AI Replicas: ${pod.aiReplicas.map(a => `${a.name} - ${a.personality}`).join(", ")}
`).join("\n")}

📅 TODAY'S SCHEDULE:
${todaySchedule.map(event => `
- ${event.title} at ${event.start.toLocaleTimeString()} (${event.start.toLocaleDateString()})
  Location: ${event.location || 'No location specified'}
  Attendees: ${event.attendees.join(", ")}
  Source: ${event.source === 'google' ? 'Google Calendar' : 'Microsoft Teams'}
`).join("\n")}

📧 UNREAD EMAILS (${unreadEmails.length}):
${unreadEmails.map(email => `
- From: ${email.from}
  Subject: ${email.subject}
  Priority: ${email.priority}
  Labels: ${email.labels.join(", ")}
  Body: ${email.body.substring(0, 100)}...
`).join("\n")}

👥 RECENT TEAMS ACTIVITY:
${recentTeamsActivity.map(msg => `
- ${msg.team} Team - ${msg.channel} channel
  From: ${msg.sender}
  Message: ${msg.message}
  Time: ${msg.timestamp.toLocaleString()}
`).join("\n")}

🔮 UPCOMING MEETINGS (Next 24 hours):
${upcomingMeetings.map(meeting => `
- ${meeting.title} at ${meeting.start.toLocaleTimeString()}
  Duration: ${Math.round((meeting.end.getTime() - meeting.start.getTime()) / (1000 * 60))} minutes
  Location: ${meeting.location || 'No location specified'}
  Attendees: ${meeting.attendees.join(", ")}
`).join("\n")}

Relevant Memories:
${relevantMemories.map(memory => `- ${memory.content} (${memory.timestamp.toLocaleDateString()})`).join("\n")}

User Context Summary:
Recent Activities: ${userContext.recentActivities.map(a => a.content).join(", ")}
Preferences: ${userContext.preferences.map(p => p.content).join(", ")}
Insights: ${userContext.insights.map(i => i.content).join(", ")}

You are a personal AI assistant for WACE (Workplace AI Collaboration Environment) with full workspace integration. You have access to:
- Google Calendar (meetings, schedule, events)
- Gmail (emails, communications, priorities)
- Microsoft Teams (team messages, collaborations)
- WACE Pods (project teams, AI replicas, activities)
- Personal memory and conversation history

You can help with:
- Schedule management and meeting coordination
- Email prioritization and response suggestions
- Team collaboration and communication
- Pod management and project insights
- Cross-platform productivity assistance
- Remembering past conversations and preferences

**IMPORTANT RESPONSE FORMATTING:**
- Use markdown formatting for better readability
- Use **bold** for important information
- Use bullet points (•) for lists
- Use code blocks for technical information
- Use tables for structured data
- Use headers (##) to organize information
- Be specific and actionable in your responses
- When web search results are provided, use them to give current, accurate information
- Always cite sources when referencing web search results

Be helpful, concise, and use the workspace context provided to give personalized responses. Reference specific meetings, emails, team messages, pods, or team members when relevant. You can proactively mention upcoming meetings, unread emails, or recent team activity.
${webSearchResults ? `

🌐 **WEB SEARCH RESULTS:**
${webSearchResults.map((result: any, index: number) => `
${index + 1}. **${result.title}**
   URL: ${result.url}
   Summary: ${result.snippet}
   Published: ${result.publishedDate}
`).join('\n')}

Use these search results to provide current, accurate information. Cite sources when referencing web search results.
` : ''}
`

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Create conversation history for context
    const historyText = conversationHistory
      .slice(-10) // Last 10 messages for context
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n")

    const prompt = `${context}

Recent conversation:
${historyText}

Current user message: ${message}

Please respond as the user's personal AI assistant, using the context about their pods and team members. Be helpful and specific to their situation.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Store conversation insight for future reference
    storeConversationInsight(userEmail, `User asked: "${message}" - AI responded with insights about their pods and activities`)

    return NextResponse.json({ response: text })

  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}
