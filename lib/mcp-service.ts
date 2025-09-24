// MCP (Model Context Protocol) Server Integration for Pod Data Retrieval

export interface MCPPod {
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

export interface MCPMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastActive: Date
}

export interface MCPActivity {
  id: string
  type: 'message' | 'file_upload' | 'meeting' | 'task_completed' | 'ai_interaction'
  title: string
  description: string
  memberId: string
  memberName: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface MCPAIReplica {
  id: string
  name: string
  personality: string
  capabilities: string[]
  memberId: string
  isActive: boolean
  lastInteraction: Date
}

export interface MCPResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

class MCPService {
  private baseUrl = process.env.MCP_SERVER_URL || 'http://localhost:3001'
  private apiKey = process.env.MCP_API_KEY || 'demo-key'

  // Get all pods for a user
  async getUserPods(userEmail: string): Promise<MCPResponse<MCPPod[]>> {
    try {
      // For now, return fake data. In production, this would call the actual MCP server
      const fakePods: MCPPod[] = [
        {
          id: "pod_trice_001",
          name: "Trice",
          type: "private",
          description: "Tech startup focused on innovative solutions",
          members: [
            {
              id: "member_001",
              name: "John Doe",
              email: "john@trice.com",
              role: "Founder & CEO",
              status: "online",
              lastActive: new Date()
            },
            {
              id: "member_002", 
              name: "Sarah Wilson",
              email: "sarah@trice.com",
              role: "CTO",
              status: "away",
              lastActive: new Date(Date.now() - 30 * 60 * 1000)
            },
            {
              id: "member_003",
              name: "Mike Chen",
              email: "mike@trice.com", 
              role: "Lead Designer",
              status: "online",
              lastActive: new Date()
            }
          ],
          recentActivity: [
            {
              id: "activity_001",
              type: "ai_interaction",
              title: "AI Replica Discussion",
              description: "Discussed Q4 product roadmap with AI replicas",
              memberId: "member_001",
              memberName: "John Doe",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              id: "activity_002",
              type: "task_completed",
              title: "Authentication Module",
              description: "Completed authentication module development",
              memberId: "member_002",
              memberName: "Sarah Wilson", 
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
            }
          ],
          aiReplicas: [
            {
              id: "ai_001",
              name: "John's AI",
              personality: "Strategic, visionary, focuses on big picture",
              capabilities: ["strategic_planning", "business_analysis", "leadership_insights"],
              memberId: "member_001",
              isActive: true,
              lastInteraction: new Date()
            },
            {
              id: "ai_002",
              name: "Sarah's AI", 
              personality: "Technical, detail-oriented, problem solver",
              capabilities: ["technical_analysis", "code_review", "architecture_design"],
              memberId: "member_002",
              isActive: true,
              lastInteraction: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ],
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date()
        },
        {
          id: "pod_zyroz_001",
          name: "Zyroz",
          type: "private", 
          description: "Marketing team focused on growth and brand development",
          members: [
            {
              id: "member_004",
              name: "Alex Rodriguez",
              email: "alex@zyroz.com",
              role: "Marketing Lead",
              status: "online",
              lastActive: new Date()
            },
            {
              id: "member_005",
              name: "Emma Thompson", 
              email: "emma@zyroz.com",
              role: "Content Creator",
              status: "offline",
              lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
          ],
          recentActivity: [
            {
              id: "activity_003",
              type: "file_upload",
              title: "Campaign Assets",
              description: "Uploaded new marketing campaign assets",
              memberId: "member_004",
              memberName: "Alex Rodriguez",
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ],
          aiReplicas: [
            {
              id: "ai_003",
              name: "Alex's AI",
              personality: "Data-driven, analytical, growth-focused",
              capabilities: ["marketing_analysis", "campaign_optimization", "data_insights"],
              memberId: "member_004",
              isActive: true,
              lastInteraction: new Date()
            }
          ],
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date()
        },
        {
          id: "pod_deeproot_001",
          name: "Deeproot",
          type: "public",
          description: "Product development team building scalable solutions",
          members: [
            {
              id: "member_006",
              name: "David Kim",
              email: "david@deeproot.com",
              role: "Product Manager",
              status: "online",
              lastActive: new Date()
            },
            {
              id: "member_007",
              name: "Lisa Park",
              email: "lisa@deeproot.com",
              role: "Senior Developer",
              status: "online", 
              lastActive: new Date()
            },
            {
              id: "member_008",
              name: "Tom Brown",
              email: "tom@deeproot.com",
              role: "QA Engineer",
              status: "away",
              lastActive: new Date(Date.now() - 15 * 60 * 1000)
            }
          ],
          recentActivity: [
            {
              id: "activity_004",
              type: "task_completed",
              title: "Sprint 23 Complete",
              description: "Completed all tasks for sprint 23",
              memberId: "member_006",
              memberName: "David Kim",
              timestamp: new Date(Date.now() - 30 * 60 * 1000)
            },
            {
              id: "activity_005",
              type: "ai_interaction",
              title: "AI Code Review",
              description: "Used AI replica for code review and optimization",
              memberId: "member_007",
              memberName: "Lisa Park",
              timestamp: new Date(Date.now() - 45 * 60 * 1000)
            }
          ],
          aiReplicas: [
            {
              id: "ai_004",
              name: "David's AI",
              personality: "Organized, process-oriented, team-focused",
              capabilities: ["project_management", "sprint_planning", "team_coordination"],
              memberId: "member_006",
              isActive: true,
              lastInteraction: new Date()
            },
            {
              id: "ai_005",
              name: "Lisa's AI",
              personality: "Technical, efficient, solution-oriented", 
              capabilities: ["code_review", "technical_mentoring", "architecture_advice"],
              memberId: "member_007",
              isActive: true,
              lastInteraction: new Date(Date.now() - 45 * 60 * 1000)
            }
          ],
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date()
        }
      ]

      return {
        success: true,
        data: fakePods,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  // Get specific pod details
  async getPodDetails(podId: string, userEmail: string): Promise<MCPResponse<MCPPod>> {
    try {
      const podsResponse = await this.getUserPods(userEmail)
      if (!podsResponse.success || !podsResponse.data) {
        return {
          success: false,
          error: 'Failed to fetch pods',
          timestamp: new Date()
        }
      }

      const pod = podsResponse.data.find(p => p.id === podId)
      if (!pod) {
        return {
          success: false,
          error: 'Pod not found',
          timestamp: new Date()
        }
      }

      return {
        success: true,
        data: pod,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  // Get pod activity
  async getPodActivity(podId: string, limit: number = 20): Promise<MCPResponse<MCPActivity[]>> {
    try {
      const podResponse = await this.getPodDetails(podId, "yf80804@gmail.com")
      if (!podResponse.success || !podResponse.data) {
        return {
          success: false,
          error: 'Failed to fetch pod',
          timestamp: new Date()
        }
      }

      const activities = podResponse.data.recentActivity
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit)

      return {
        success: true,
        data: activities,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  // Get AI replica interactions
  async getAIReplicaInteractions(podId: string, replicaId?: string): Promise<MCPResponse<MCPActivity[]>> {
    try {
      const podResponse = await this.getPodDetails(podId, "yf80804@gmail.com")
      if (!podResponse.success || !podResponse.data) {
        return {
          success: false,
          error: 'Failed to fetch pod',
          timestamp: new Date()
        }
      }

      let activities = podResponse.data.recentActivity.filter(activity => 
        activity.type === 'ai_interaction'
      )

      if (replicaId) {
        // Filter by specific AI replica if provided
        activities = activities.filter(activity => 
          activity.metadata?.replicaId === replicaId
        )
      }

      return {
        success: true,
        data: activities,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  // Search across pods
  async searchPods(query: string, userEmail: string): Promise<MCPResponse<MCPPod[]>> {
    try {
      const podsResponse = await this.getUserPods(userEmail)
      if (!podsResponse.success || !podsResponse.data) {
        return {
          success: false,
          error: 'Failed to fetch pods',
          timestamp: new Date()
        }
      }

      const searchTerm = query.toLowerCase()
      const filteredPods = podsResponse.data.filter(pod => 
        pod.name.toLowerCase().includes(searchTerm) ||
        pod.description.toLowerCase().includes(searchTerm) ||
        pod.members.some(member => 
          member.name.toLowerCase().includes(searchTerm) ||
          member.role.toLowerCase().includes(searchTerm)
        )
      )

      return {
        success: true,
        data: filteredPods,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }
}

// Export singleton instance
export const mcpService = new MCPService()

// Helper functions
export const getUserPods = (userEmail: string) => mcpService.getUserPods(userEmail)
export const getPodDetails = (podId: string, userEmail: string) => mcpService.getPodDetails(podId, userEmail)
export const getPodActivity = (podId: string, limit?: number) => mcpService.getPodActivity(podId, limit)
export const getAIReplicaInteractions = (podId: string, replicaId?: string) => mcpService.getAIReplicaInteractions(podId, replicaId)
export const searchPods = (query: string, userEmail: string) => mcpService.searchPods(query, userEmail)
