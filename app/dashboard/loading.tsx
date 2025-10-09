export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-8">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        
        <div className="h-32 w-full bg-muted rounded-2xl animate-pulse" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
          
          <div className="h-96 bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
