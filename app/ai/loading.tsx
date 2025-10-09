export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.6_0.2_290)] animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading AI Assistant...</p>
      </div>
    </div>
  )
}
