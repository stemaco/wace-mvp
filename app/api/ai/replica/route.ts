import { NextRequest, NextResponse } from "next/server"
import { processAIMentions, getAvailableAIReplicas } from "@/lib/ai-replica-service"

export async function POST(request: NextRequest) {
  try {
    const { message, podId, userEmail } = await request.json()

    if (!message || !podId || !userEmail) {
      return NextResponse.json(
        { error: "Message, podId, and userEmail are required" },
        { status: 400 }
      )
    }

    // Process AI mentions in the message
    const { processedMessage, aiResponses } = await processAIMentions(
      message,
      podId,
      userEmail
    )

    return NextResponse.json({
      success: true,
      processedMessage,
      aiResponses,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI replica API error:", error)
    return NextResponse.json(
      { error: "Failed to process AI replica mentions" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const podId = searchParams.get('podId')
    const userEmail = searchParams.get('userEmail')

    if (!podId || !userEmail) {
      return NextResponse.json(
        { error: "podId and userEmail are required" },
        { status: 400 }
      )
    }

    // Get available AI replicas in the pod
    const replicas = getAvailableAIReplicas(podId, userEmail)

    return NextResponse.json({
      success: true,
      replicas,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Get AI replicas error:", error)
    return NextResponse.json(
      { error: "Failed to get AI replicas" },
      { status: 500 }
    )
  }
}
