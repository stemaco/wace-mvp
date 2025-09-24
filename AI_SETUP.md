# AI Assistant Setup Guide

## Overview
The WACE MVP now includes a premium full-screen AI assistant powered by Google Gemini 2.5 Flash. This AI assistant has full workspace integration with Google Calendar, Gmail, Microsoft Teams, and maintains a shared memory system to provide comprehensive productivity assistance.

## Features
- **Premium AI Assistant**: Available for premium users (currently enabled for yf80804@gmail.com)
- **Full-Screen Interface**: Immersive full-screen chat experience
- **Workspace Integration**: Connected to Google Calendar, Gmail, and Microsoft Teams
- **Pod Context Awareness**: AI knows about all your pods, team members, and recent activities
- **Shared Memory System**: AI remembers past conversations and user preferences
- **Real-time Chat Interface**: Beautiful chat UI with typing indicators and message history
- **Cross-Platform Insights**: AI can reference meetings, emails, and team messages
- **Web Search Integration**: Real-time web search for current information
- **AI Replica Interactions**: Mention team members' AI replicas with @username-ai

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
1. Open the `.env.local` file in your project root
2. Replace `your_gemini_api_key_here` with your actual Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Restart the Development Server
After adding the API key, restart your development server:
```bash
npm run dev
```

## Usage

### Accessing the AI Assistant
1. Look for the purple sparkles (✨) icon in the sidebar
2. Click on it to open the AI assistant
3. The icon has a small gradient indicator showing it's a premium feature

### What the AI Can Help With
- **Schedule Management**: Ask about your calendar, upcoming meetings, and availability
- **Email Management**: Get summaries of unread emails, priority messages, and response suggestions
- **Team Collaboration**: Access Teams messages, coordinate with team members
- **Pod Management**: Ask about your pods, team members, recent activities
- **Cross-Platform Insights**: Get unified view of your workspace across all platforms
- **Meeting Coordination**: Schedule meetings, check availability, prepare for upcoming events
- **Web Search**: Get real-time information from the web for current events and topics
- **AI Replica Interactions**: Chat with team members' AI replicas using @username-ai mentions
- **Productivity Assistance**: General questions about your work and schedule

### Example Queries
- "What meetings do I have today?"
- "Do I have any unread emails that need attention?"
- "What's happening in my Teams channels?"
- "What's happening in my Trice pod?"
- "Can you help me prepare for my 2 PM meeting?"
- "Who are the members of my Zyroz team?"
- "What recent activities have I been involved in?"
- "Can you help me plan a meeting with my team?"
- "What AI replicas are available in my pods?"
- "Do I have any conflicts in my schedule tomorrow?"
- "Search for the latest AI developments"
- "What are the current trends in web development?"
- "Find recent news about [topic]"
- "@john-ai what's your availability for a meeting tomorrow?"
- "@sarah-ai can you help with the technical review?"
- "@mike-ai what do you think about the new design mockups?"

## Technical Details

### Memory System
The AI assistant uses a sophisticated memory system that:
- Stores conversation insights
- Remembers user preferences
- Tracks pod activities
- Provides context-aware responses

### Fake Data
For testing purposes, the system includes fake data for:

**Pods:**
- **Trice**: Tech startup with 3 members and AI replicas
- **Zyroz**: Marketing team with 2 members and AI replicas  
- **Deeproot**: Product development team with 3 members and AI replicas

**Workspace Integration:**
- **Google Calendar**: 4 upcoming meetings including pod standups, product reviews, and client presentations
- **Gmail**: 4 emails including project updates, marketing results, bug reports, and team syncs
- **Microsoft Teams**: 4 recent messages across different team channels with project updates and collaboration

### Premium User Check
Currently, the premium AI assistant is enabled for `yf80804@gmail.com`. In a production environment, this would be tied to actual subscription status.

## Troubleshooting

### AI Not Responding
1. Check that your Gemini API key is correctly set in `.env.local`
2. Verify the API key has proper permissions
3. Check the browser console for any error messages

### Memory Not Working
The memory system is currently in-memory only. In production, this would be backed by a database.

## Future Enhancements
- Database-backed memory persistence
- Real user authentication and subscription management
- Integration with actual pod data
- Advanced AI replica interactions
- Voice interface support
