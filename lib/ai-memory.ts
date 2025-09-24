// AI Memory System for storing and retrieving user context
interface MemoryEntry {
  id: string
  type: 'pod_activity' | 'user_preference' | 'conversation' | 'insight'
  content: string
  timestamp: Date
  podId?: string
  userId: string
  metadata?: Record<string, any>
}

class AIMemoryService {
  private memories: MemoryEntry[] = []

  // Store a memory entry
  storeMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>) {
    const memory: MemoryEntry = {
      ...entry,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    
    this.memories.push(memory)
    
    // Keep only last 1000 memories to prevent memory bloat
    if (this.memories.length > 1000) {
      this.memories = this.memories.slice(-1000)
    }
    
    return memory.id
  }

  // Retrieve memories by type and user
  getMemories(userId: string, type?: MemoryEntry['type'], limit: number = 50) {
    let filtered = this.memories.filter(m => m.userId === userId)
    
    if (type) {
      filtered = filtered.filter(m => m.type === type)
    }
    
    // Sort by timestamp, most recent first
    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  // Get relevant memories for a query
  getRelevantMemories(userId: string, query: string, limit: number = 20) {
    const userMemories = this.memories.filter(m => m.userId === userId)
    
    // Simple keyword matching for now
    const queryWords = query.toLowerCase().split(' ')
    
    const scored = userMemories.map(memory => {
      const content = memory.content.toLowerCase()
      const score = queryWords.reduce((acc, word) => {
        return acc + (content.includes(word) ? 1 : 0)
      }, 0)
      
      return { memory, score }
    })
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.memory)
  }

  // Store pod activity
  storePodActivity(userId: string, podId: string, activity: string, metadata?: Record<string, any>) {
    return this.storeMemory({
      type: 'pod_activity',
      content: activity,
      podId,
      userId,
      metadata
    })
  }

  // Store user preference
  storeUserPreference(userId: string, preference: string, metadata?: Record<string, any>) {
    return this.storeMemory({
      type: 'user_preference',
      content: preference,
      userId,
      metadata
    })
  }

  // Store conversation insight
  storeConversationInsight(userId: string, insight: string, metadata?: Record<string, any>) {
    return this.storeMemory({
      type: 'insight',
      content: insight,
      userId,
      metadata
    })
  }

  // Get user context summary
  getUserContextSummary(userId: string) {
    const recentActivities = this.getMemories(userId, 'pod_activity', 10)
    const preferences = this.getMemories(userId, 'user_preference', 5)
    const insights = this.getMemories(userId, 'insight', 5)
    
    return {
      recentActivities: recentActivities.map(m => ({
        content: m.content,
        podId: m.podId,
        timestamp: m.timestamp
      })),
      preferences: preferences.map(m => ({
        content: m.content,
        timestamp: m.timestamp
      })),
      insights: insights.map(m => ({
        content: m.content,
        timestamp: m.timestamp
      }))
    }
  }
}

// Export singleton instance
export const aiMemory = new AIMemoryService()

// Helper functions for common operations
export const storePodActivity = (userId: string, podId: string, activity: string) => {
  return aiMemory.storePodActivity(userId, podId, activity)
}

export const storeUserPreference = (userId: string, preference: string) => {
  return aiMemory.storeUserPreference(userId, preference)
}

export const getRelevantMemories = (userId: string, query: string) => {
  return aiMemory.getRelevantMemories(userId, query)
}

export const getUserContextSummary = (userId: string) => {
  return aiMemory.getUserContextSummary(userId)
}

export const storeConversationInsight = (userId: string, insight: string) => {
  return aiMemory.storeConversationInsight(userId, insight)
}
