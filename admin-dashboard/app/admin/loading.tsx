import { Card } from "@/components/ui/card"

export default function AdminLoadingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded-lg w-40 animate-pulse" />
        <div className="h-4 bg-muted rounded-lg w-60 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded-lg w-24 animate-pulse" />
              <div className="h-8 bg-muted rounded-lg w-16 animate-pulse" />
              <div className="h-3 bg-muted rounded-lg w-32 animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
