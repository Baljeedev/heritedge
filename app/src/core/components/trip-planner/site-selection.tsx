"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { useHeritageSites } from "@/lib/api"

interface SiteSelectionProps {
  selectedSites: string[]
  onSelect: (sites: string[]) => void
}

export function SiteSelection({ selectedSites, onSelect }: SiteSelectionProps) {
  const { data, isLoading } = useHeritageSites({ limit: 100 })
  const sites = data?.sites || []

  const handleToggle = (siteId: string) => {
    if (selectedSites.includes(siteId)) {
      onSelect(selectedSites.filter((id) => id !== siteId))
    } else {
      onSelect([...selectedSites, siteId])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl  font-bold text-foreground mb-6">Which sites would you like to visit?</h2>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading sites...</div>
      ) : sites.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No sites available</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sites.map((site) => (
            <div
              key={site._id}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedSites.includes(site._id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleToggle(site._id)}
            >
              <div className="flex gap-4 p-4">
                <Checkbox checked={selectedSites.includes(site._id)} onCheckedChange={() => handleToggle(site._id)} />
                <div className="flex-1">
                  <h3 className=" font-bold text-foreground">{site.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{site.location}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{site.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
