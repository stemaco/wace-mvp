"use client"

import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface WebSearchResult {
  title: string
  url: string
  snippet: string
  publishedDate: string
}

interface WebSearchResultsProps {
  results: WebSearchResult[]
  className?: string
}

export function WebSearchResults({ results, className }: WebSearchResultsProps) {
  if (!results || results.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-blue-400 flex items-center space-x-2">
        <span>🌐</span>
        <span>Web Search Results</span>
      </h3>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                  {result.title}
                </h4>
                <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                  {result.snippet}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>{new Date(result.publishedDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="truncate max-w-32">{result.url}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
