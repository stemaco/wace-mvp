"use client"

import { File, Image, FileText, FileSpreadsheet, FileVideo, Music, Archive, X as XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilePreviewProps {
  file: File
  onRemove: () => void
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase()
    const name = file.name.toLowerCase()
    
    if (type.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      return <Image className="h-4 w-4 text-blue-400" />
    }
    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText className="h-4 w-4 text-red-400" />
    }
    if (type.includes('spreadsheet') || name.match(/\.(xlsx|xls|csv)$/)) {
      return <FileSpreadsheet className="h-4 w-4 text-green-400" />
    }
    if (type.startsWith('video/') || name.match(/\.(mp4|avi|mov|wmv)$/)) {
      return <FileVideo className="h-4 w-4 text-purple-400" />
    }
    if (type.startsWith('audio/') || name.match(/\.(mp3|wav|flac|aac)$/)) {
      return <Music className="h-4 w-4 text-yellow-400" />
    }
    if (name.match(/\.(zip|rar|7z|tar|gz)$/)) {
      return <Archive className="h-4 w-4 text-orange-400" />
    }
    return <File className="h-4 w-4 text-gray-400" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2 text-sm group">
      {getFileIcon(file)}
      <div className="flex-1 min-w-0">
        <p className="text-gray-200 truncate">{file.name}</p>
        <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
