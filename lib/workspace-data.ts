// Fake workspace data for Google Calendar, Gmail, and Microsoft Teams integration

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location?: string
  attendees: string[]
  description?: string
  source: 'google' | 'teams'
}

export interface Email {
  id: string
  subject: string
  from: string
  to: string[]
  date: Date
  body: string
  isRead: boolean
  priority: 'low' | 'normal' | 'high'
  labels: string[]
}

export interface TeamsMessage {
  id: string
  channel: string
  sender: string
  message: string
  timestamp: Date
  team: string
}

export interface WorkspaceData {
  calendar: CalendarEvent[]
  emails: Email[]
  teamsMessages: TeamsMessage[]
}

// Fake workspace data for yf80804@gmail.com
export const getWorkspaceData = (userEmail: string): WorkspaceData => {
  if (userEmail !== "yf80804@gmail.com") {
    return { calendar: [], emails: [], teamsMessages: [] }
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  return {
    calendar: [
      {
        id: "cal_1",
        title: "Trice Pod Standup",
        start: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM today
        end: new Date(today.getTime() + 9 * 30 * 60 * 1000), // 9:30 AM today
        location: "Teams Meeting",
        attendees: ["john@trice.com", "sarah@trice.com", "mike@trice.com"],
        description: "Daily standup for Trice project updates",
        source: "teams"
      },
      {
        id: "cal_2", 
        title: "Product Review Meeting",
        start: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM today
        end: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 3 PM today
        location: "Conference Room A",
        attendees: ["alex@zyroz.com", "emma@zyroz.com", "david@deeproot.com"],
        description: "Q4 product roadmap review and planning",
        source: "google"
      },
      {
        id: "cal_3",
        title: "Client Presentation - Zyroz",
        start: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10 AM tomorrow
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 11 AM tomorrow
        location: "Zoom Meeting",
        attendees: ["client@example.com", "alex@zyroz.com"],
        description: "Marketing campaign presentation for new client",
        source: "google"
      },
      {
        id: "cal_4",
        title: "Deeproot Sprint Planning",
        start: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // 1 PM day after tomorrow
        end: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000), // 3 PM day after tomorrow
        location: "Teams Meeting",
        attendees: ["david@deeproot.com", "lisa@deeproot.com", "tom@deeproot.com"],
        description: "Sprint 24 planning and task assignment",
        source: "teams"
      }
    ],
    emails: [
      {
        id: "email_1",
        subject: "Trice Project Update - Q4 Milestones",
        from: "sarah@trice.com",
        to: ["yf80804@gmail.com"],
        date: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        body: "Hi YF808, I wanted to update you on our Q4 milestones. We've completed the authentication module and are now working on the dashboard redesign. The team is on track to meet our December deadline.",
        isRead: false,
        priority: "high",
        labels: ["work", "trice", "urgent"]
      },
      {
        id: "email_2",
        subject: "Marketing Campaign Results - Zyroz",
        from: "alex@zyroz.com", 
        to: ["yf80804@gmail.com"],
        date: new Date(today.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        body: "Great news! Our latest marketing campaign for Zyroz has seen a 25% increase in engagement. The social media metrics are looking promising. Let's discuss the next phase in our meeting tomorrow.",
        isRead: true,
        priority: "normal",
        labels: ["work", "zyroz", "marketing"]
      },
      {
        id: "email_3",
        subject: "Bug Report - Deeproot Authentication",
        from: "tom@deeproot.com",
        to: ["yf80804@gmail.com"],
        date: new Date(today.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        body: "Found a critical bug in the authentication flow. Users are getting logged out unexpectedly. I've created a hotfix and deployed it to staging. Need your review before production release.",
        isRead: false,
        priority: "high",
        labels: ["work", "deeproot", "bug", "urgent"]
      },
      {
        id: "email_4",
        subject: "Weekly Team Sync - All Pods",
        from: "yf80804@gmail.com",
        to: ["john@trice.com", "alex@zyroz.com", "david@deeproot.com"],
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Yesterday
        body: "Hi team, let's sync up on our weekly progress. Please prepare updates on your respective pods and any blockers you're facing. Meeting scheduled for Friday at 2 PM.",
        isRead: true,
        priority: "normal",
        labels: ["work", "meeting", "all-pods"]
      }
    ],
    teamsMessages: [
      {
        id: "teams_1",
        channel: "general",
        sender: "Sarah Wilson",
        message: "Hey team, the new authentication module is ready for testing. Can everyone try logging in and let me know if you encounter any issues?",
        timestamp: new Date(today.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        team: "Trice"
      },
      {
        id: "teams_2",
        channel: "marketing",
        sender: "Alex Rodriguez",
        message: "The campaign metrics are looking great! 25% increase in engagement this week. Should we increase the budget for next month?",
        timestamp: new Date(today.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        team: "Zyroz"
      },
      {
        id: "teams_3",
        channel: "development",
        sender: "Lisa Park",
        message: "I've fixed the authentication bug Tom reported. The hotfix is deployed to staging. Can someone test it before we push to production?",
        timestamp: new Date(today.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        team: "Deeproot"
      },
      {
        id: "teams_4",
        channel: "general",
        sender: "Mike Chen",
        message: "The new dashboard design is ready for review. I've shared the Figma link in the design channel. Feedback welcome!",
        timestamp: new Date(today.getTime() - 7 * 60 * 60 * 1000), // 7 hours ago
        team: "Trice"
      }
    ]
  }
}

// Helper functions to get specific data
export const getUpcomingMeetings = (userEmail: string, hours: number = 24) => {
  const data = getWorkspaceData(userEmail)
  const now = new Date()
  const future = new Date(now.getTime() + hours * 60 * 60 * 1000)
  
  return data.calendar.filter(event => 
    event.start >= now && event.start <= future
  ).sort((a, b) => a.start.getTime() - b.start.getTime())
}

export const getUnreadEmails = (userEmail: string) => {
  const data = getWorkspaceData(userEmail)
  return data.emails.filter(email => !email.isRead)
}

export const getRecentTeamsActivity = (userEmail: string, hours: number = 24) => {
  const data = getWorkspaceData(userEmail)
  const now = new Date()
  const past = new Date(now.getTime() - hours * 60 * 60 * 1000)
  
  return data.teamsMessages.filter(message => 
    message.timestamp >= past
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export const getTodaySchedule = (userEmail: string) => {
  const data = getWorkspaceData(userEmail)
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  
  return data.calendar.filter(event => 
    event.start >= startOfDay && event.start < endOfDay
  ).sort((a, b) => a.start.getTime() - b.start.getTime())
}
