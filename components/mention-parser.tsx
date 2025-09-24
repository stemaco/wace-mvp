"use client"

import { cn } from "@/lib/utils"

interface MentionParserProps {
  text: string
  className?: string
}

export function MentionParser({ text, className }: MentionParserProps) {
  // Parse @username-ai mentions
  const parseMentions = (text: string) => {
    const mentionRegex = /@(\w+)-ai/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }

      // Add the mention
      parts.push({
        type: 'mention',
        content: match[0],
        username: match[1]
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }

    return parts
  }

  const parts = parseMentions(text)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'mention') {
          return (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md bg-purple-600/20 text-purple-300 text-sm font-medium border border-purple-500/30"
            >
              @{part.username}-ai
            </span>
          )
        }
        return <span key={index}>{part.content}</span>
      })}
    </span>
  )
}
