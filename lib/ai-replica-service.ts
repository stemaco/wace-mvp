// AI Replica Service for handling @username-ai mentions in pods

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getWorkspaceData, getTodaySchedule } from "@/lib/workspace-data"
import { getUserPods } from "@/lib/mcp-service"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export interface AIMention {
  username: string
  fullMention: string
  position: number
}

export interface AIReplicaResponse {
  success: boolean
  response?: string
  error?: string
  mentionedUser?: string
  userSchedule?: any
}

// Parse @username-ai mentions from message
export function parseAIMentions(message: string): AIMention[] {
  const mentionRegex = /@(\w+)-ai/g
  const mentions: AIMention[] = []
  let match

  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push({
      username: match[1],
      fullMention: match[0],
      position: match.index
    })
  }

  return mentions
}

// Get user's AI replica personality and context
export function getUserAIReplica(userEmail: string, podId: string) {
  // This would typically come from a database, but for demo we'll use the MCP service
  const podsResponse = getUserPods(userEmail)
  
  if (!podsResponse.success || !podsResponse.data) {
    return null
  }

  const pod = podsResponse.data.find(p => p.id === podId)
  if (!pod) {
    return null
  }

  // Find the user's AI replica in the pod
  const userReplica = pod.aiReplicas.find(replica => 
    replica.memberId === userEmail || 
    replica.name.toLowerCase().includes(userEmail.split('@')[0].toLowerCase())
  )

  return userReplica
}

// Generate AI replica response
export async function generateAIReplicaResponse(
  mentionedUser: string,
  originalMessage: string,
  podId: string,
  currentUserEmail: string
): Promise<AIReplicaResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "AI service not configured"
      }
    }

    // Get the mentioned user's AI replica
    const userReplica = getUserAIReplica(mentionedUser, podId)
    if (!userReplica) {
      return {
        success: false,
        error: `AI replica for ${mentionedUser} not found in this pod`
      }
    }

    // Get user's schedule and context
    const workspaceData = getWorkspaceData(mentionedUser)
    const todaySchedule = getTodaySchedule(mentionedUser)
    const currentTime = new Date()

    // Create context for the AI replica
    const context = `
You are ${userReplica.name}, an AI replica of ${mentionedUser}.

**Your Personality:** ${userReplica.personality}

**Your Capabilities:** ${userReplica.capabilities.join(", ")}

**Current Time:** ${currentTime.toLocaleString()}

**Your Schedule Today:**
${todaySchedule.map(event => `
- ${event.title} at ${event.start.toLocaleTimeString()}
  Location: ${event.location || 'No location specified'}
  Attendees: ${event.attendees.join(", ")}
`).join("\n")}

**Your Recent Activities:**
${workspaceData.calendar.slice(0, 3).map(event => `
- ${event.title} (${event.start.toLocaleDateString()})
`).join("\n")}

**Your Recent Emails:**
${workspaceData.emails.slice(0, 3).map(email => `
- ${email.subject} from ${email.from} (${email.priority} priority)
`).join("\n")}

**Your Teams Activity:**
${workspaceData.teamsMessages.slice(0, 3).map(msg => `
- ${msg.message} in ${msg.team} team
`).join("\n")}

**Message Context:**
Someone mentioned you (@${mentionedUser}-ai) in a pod conversation with this message:
"${originalMessage}"

**Instructions:**
- Respond as if you are the actual person, not an AI
- Consider your current schedule and availability
- Reference your recent activities and context
- Be helpful and authentic to your personality
- Keep responses concise but informative
- If you're busy with meetings, mention it
- If you have relevant expertise, offer to help

Respond naturally as ${mentionedUser} would, considering your current schedule and context.
`

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const result = await model.generateContent(context)
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      response: text,
      mentionedUser,
      userSchedule: todaySchedule
    }

  } catch (error) {
    console.error("AI replica response error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate AI replica response"
    }
  }
}

// Process message with AI mentions
export async function processAIMentions(
  message: string,
  podId: string,
  currentUserEmail: string
): Promise<{ processedMessage: string; aiResponses: AIReplicaResponse[] }> {
  const mentions = parseAIMentions(message)
  const aiResponses: AIReplicaResponse[] = []

  if (mentions.length === 0) {
    return { processedMessage: message, aiResponses: [] }
  }

  // Generate responses for each mentioned AI replica
  for (const mention of mentions) {
    try {
      const response = await generateAIReplicaResponse(
        mention.username,
        message,
        podId,
        currentUserEmail
      )
      aiResponses.push(response)
    } catch (error) {
      aiResponses.push({
        success: false,
        error: `Failed to get response from ${mention.username}-ai`,
        mentionedUser: mention.username
      })
    }
  }

  return { processedMessage: message, aiResponses }
}

// Get available AI replicas in a pod
export function getAvailableAIReplicas(podId: string, userEmail: string) {
  const podsResponse = getUserPods(userEmail)
  
  if (!podsResponse.success || !podsResponse.data) {
    return []
  }

  const pod = podsResponse.data.find(p => p.id === podId)
  if (!pod) {
    return []
  }

  return pod.aiReplicas.map(replica => ({
    id: replica.id,
    name: replica.name,
    username: replica.memberId.split('@')[0],
    personality: replica.personality,
    capabilities: replica.capabilities,
    isActive: replica.isActive
  }))
}
