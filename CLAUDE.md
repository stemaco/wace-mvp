# CLAUDE.md - WACE MVP Project Guide

## Project Overview

**WACE (Workplace AI Collaboration Environment)** is a Next.js 14-based web application that provides AI-powered Pods for founders, teams, and freelancers. The platform integrates workspace tools (Google Calendar, Gmail, Microsoft Teams) with AI assistants and team collaboration features.

**Tech Stack:**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **AI:** Google Gemini 2.0 Flash (via `@google/generative-ai`)
- **Fonts:** Geist Sans & Geist Mono
- **Analytics:** Vercel Analytics

## Project Structure

```
/home/yf808/ai/wace-mvp/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   │   ├── ai/
│   │   │   ├── chat/         # AI chat endpoint
│   │   │   └── replica/      # AI replica interaction endpoint
│   │   └── web-search/       # Web search integration
│   ├── auth/                 # Authentication pages
│   │   ├── signin/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/            # Main dashboard
│   │   └── pods/             # Pod management
│   │       ├── [id]/         # Dynamic pod detail page
│   │       └── create/       # Create new pod
│   ├── explore/              # Explore public pods
│   ├── settings/             # User settings
│   ├── shop/                 # Shop pages
│   │   └── checkout/
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── ui/                   # shadcn/ui components (40+ components)
│   ├── ai-assistant.tsx      # Full-screen AI assistant modal
│   ├── ai-replica-response.tsx
│   ├── dashboard-sidebar.tsx # Main navigation sidebar
│   ├── file-preview.tsx
│   ├── mention-parser.tsx    # @username-ai mention parser
│   ├── message-renderer.tsx  # Markdown message renderer
│   ├── pod-sidebar.tsx
│   ├── theme-provider.tsx
│   └── web-search-results.tsx
├── lib/                      # Utility libraries
│   ├── ai-memory.ts          # AI memory/context system
│   ├── ai-replica-service.ts # AI replica management
│   ├── mcp-service.ts        # Model Context Protocol (pod data)
│   ├── utils.ts              # Utility functions (cn helper)
│   └── workspace-data.ts     # Fake workspace data (Calendar, Gmail, Teams)
├── types/
│   └── speech-recognition.d.ts
├── styles/
│   └── highlight.css         # Code syntax highlighting
├── hooks/                    # React hooks
├── public/                   # Static assets
├── .env.local                # Environment variables
├── next.config.mjs           # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
├── components.json           # shadcn/ui configuration
├── package.json              # Dependencies
└── AI_SETUP.md              # AI assistant setup guide

```

## Key Features

### 1. AI-Powered Assistant
- **Location:** Components: `components/ai-assistant.tsx`, API: `app/api/ai/chat/route.ts`
- Premium full-screen AI assistant powered by Google Gemini 2.0 Flash
- Workspace integration (Google Calendar, Gmail, Microsoft Teams)
- Pod context awareness
- Shared memory system for conversation history
- Web search integration
- Markdown formatting with syntax highlighting

### 2. AI Replica System
- **Location:** `lib/ai-replica-service.ts`, `app/api/ai/replica/route.ts`
- Team members can create AI replicas with unique personalities
- Mention system using `@username-ai` syntax
- AI replicas respond based on member's role and expertise
- Each pod has associated AI replicas for team members

### 3. Pod Management (MCP Service)
- **Location:** `lib/mcp-service.ts`
- Private and public pods
- Team member management
- Activity tracking (messages, file uploads, meetings, tasks, AI interactions)
- AI replica associations
- Currently uses fake data (3 pods: Trice, Zyroz, Deeproot)

### 4. Workspace Integration
- **Location:** `lib/workspace-data.ts`
- **Google Calendar:** Meeting scheduling, today's schedule, upcoming events
- **Gmail:** Unread emails, priority filtering, labels
- **Microsoft Teams:** Recent team activity, channel messages
- Currently uses fake data for demo purposes

### 5. Memory System
- **Location:** `lib/ai-memory.ts`
- Stores user preferences, pod activities, conversation insights
- Keyword-based relevance scoring
- In-memory storage (max 1000 entries)
- Provides context for AI responses

## Development

### Environment Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Run development server:**
```bash
npm run dev
```
Opens at http://localhost:3000

### Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Build Configuration

**Next.js Config (`next.config.mjs`):**
- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Image optimization disabled (unoptimized: true)

**TypeScript Config:**
- Target: ES6
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Module resolution: bundler

## API Routes

### `/api/ai/chat` (POST)
**Purpose:** Main AI assistant chat endpoint

**Request Body:**
```typescript
{
  message: string
  userEmail: string
  conversationHistory: Array<{role: string, content: string}>
  webSearchResults?: Array<{title: string, url: string, snippet: string, publishedDate: string}>
}
```

**Response:**
```typescript
{
  response: string  // Markdown-formatted AI response
}
```

**Features:**
- Retrieves user pods from MCP service
- Gets workspace data (calendar, emails, teams)
- Fetches relevant memories
- Generates context-aware responses using Gemini 2.0 Flash
- Stores conversation insights

### `/api/ai/replica` (POST)
**Purpose:** AI replica interaction endpoint

**Request Body:**
```typescript
{
  message: string
  replicaId: string
  userEmail: string
  podId: string
}
```

**Response:**
```typescript
{
  response: string
  replicaInfo: {
    name: string
    personality: string
    capabilities: string[]
    memberId: string
  }
}
```

### `/api/web-search` (POST)
**Purpose:** Web search integration for AI assistant

**Request Body:**
```typescript
{
  query: string
}
```

**Response:**
```typescript
{
  results: Array<{
    title: string
    url: string
    snippet: string
    publishedDate: string
  }>
}
```

## Key Components

### Dashboard Sidebar (`components/dashboard-sidebar.tsx`)
- Main navigation with icon-based UI
- Pod avatars with active indicators
- Premium AI assistant access (Sparkles icon)
- User profile section
- 72px fixed width, dark theme

### AI Assistant (`components/ai-assistant.tsx`)
- Full-screen modal overlay
- Chat interface with message history
- Web search integration
- AI replica mention support (@username-ai)
- Markdown rendering with syntax highlighting
- File attachment support
- Voice input support

### Message Renderer (`components/message-renderer.tsx`)
- Renders markdown with `react-markdown`
- Syntax highlighting via `rehype-highlight`
- GitHub-flavored markdown support (`remark-gfm`)
- Code block styling

### Mention Parser (`components/mention-parser.tsx`)
- Detects `@username-ai` mentions in messages
- Triggers AI replica responses
- Highlights mentions in UI

## Data Models

### Pod (MCPPod)
```typescript
interface MCPPod {
  id: string
  name: string
  type: 'private' | 'public'
  description: string
  members: MCPMember[]
  recentActivity: MCPActivity[]
  aiReplicas: MCPAIReplica[]
  createdAt: Date
  updatedAt: Date
}
```

### Member (MCPMember)
```typescript
interface MCPMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastActive: Date
}
```

### AI Replica (MCPAIReplica)
```typescript
interface MCPAIReplica {
  id: string
  name: string
  personality: string
  capabilities: string[]
  memberId: string
  isActive: boolean
  lastInteraction: Date
}
```

### Memory Entry
```typescript
interface MemoryEntry {
  id: string
  type: 'pod_activity' | 'user_preference' | 'conversation' | 'insight'
  content: string
  timestamp: Date
  podId?: string
  userId: string
  metadata?: Record<string, any>
}
```

## Current Limitations & TODOs

### Data Persistence
- All data is currently in-memory (fake data)
- No database integration yet
- Memory system resets on server restart

### Authentication
- Hardcoded premium user: `yf80804@gmail.com`
- No actual authentication system
- No subscription management

### Workspace Integration
- Google Calendar: Fake data only
- Gmail: Fake data only
- Microsoft Teams: Fake data only
- Needs real OAuth integration

### Future Enhancements
1. Database integration (PostgreSQL/MongoDB)
2. Real authentication (NextAuth.js, Clerk, or Supabase Auth)
3. Actual workspace API integrations
4. Real-time collaboration (WebSockets/Pusher)
5. File upload and storage (S3/Cloudinary)
6. Voice interface improvements
7. Mobile responsiveness
8. Pod templates and discovery
9. Analytics dashboard
10. Payment integration (Stripe)

## Styling

### Theme - Notion-Inspired Design
- **Light mode by default** (Notion-style clean aesthetic)
- **Color Scheme:**
  - Light mode: White background (#ffffff), Notion beige accent (#f7f6f3)
  - Dark mode: Dark gray background (#191919), subtle borders (#373737)
  - Text: Notion brown (#37352f) in light, white in dark
  - Primary accent: Notion blue (#2383e2)
- **Premium features:** Purple to blue gradient

### UI Components
- All shadcn/ui components in `components/ui/`
- Radix UI primitives for accessibility
- Tailwind CSS v4 for styling
- Custom animations via `tailwindcss-animate`
- **Notion-style sidebar** (`components/notion-sidebar.tsx`)
- Clean borders, generous spacing, minimal shadows

### Typography
- **Primary: Inter font** (Notion's font choice)
- Monospace: System monospace stack
- Font loaded via next/font/google
- Antialiased rendering for crisp text

## Testing the Application

### Premium User Access
Currently hardcoded for `yf80804@gmail.com`

### Testing AI Assistant
1. Click purple Sparkles icon in sidebar
2. Try example queries:
   - "What meetings do I have today?"
   - "Show me my unread emails"
   - "What's happening in my Trice pod?"
   - "@john-ai what's your availability?"

### Testing Web Search
- Ask AI assistant questions requiring current information
- AI automatically triggers web search when needed

### Testing AI Replicas
- Use `@username-ai` mentions in chat
- Available replicas in fake data: john-ai, sarah-ai, mike-ai, alex-ai, emma-ai, david-ai, lisa-ai, tom-ai

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (GEMINI_API_KEY)
4. Deploy

### Environment Variables Required
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Optional (for production):
```env
MCP_SERVER_URL=http://your-mcp-server-url
MCP_API_KEY=your_mcp_api_key
```

## Git Information

- **Current Branch:** main
- **Remote:** origin
- **Recent Commits:**
  - 4b1563e: fix: Resolve syntax error in AI assistant component
  - eaed1d8: feat: Add AI replica mention system with @username-ai interactions
  - c4b1af1: first commit

## Support & Documentation

- **AI Setup Guide:** See `AI_SETUP.md` for detailed AI assistant setup
- **Component Docs:** All shadcn/ui components documented at ui.shadcn.com
- **Next.js Docs:** nextjs.org/docs
- **Gemini API:** ai.google.dev/docs

## Premium Features

Currently available for premium users:
- ✨ Full-screen AI Assistant
- 🤖 AI Replica interactions
- 🔍 Web search integration
- 📅 Workspace integrations
- 🧠 Shared memory system

---

**Last Updated:** 2025-10-02
**Version:** 0.1.0
**Maintained by:** YF808 Team
