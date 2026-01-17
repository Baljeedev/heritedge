"use client"
import { HERITAGE_SITES } from "@/data/heritage-sites"
import { Checkbox } from "@/components/ui/checkbox"

interface SiteSelectionProps {
  selectedSites: number[]
  onSelect: (sites: number[]) => void
}

export function SiteSelection({ selectedSites, onSelect }: SiteSelectionProps) {
  const handleToggle = (siteId: number) => {
    if (selectedSites.includes(siteId)) {
      onSelect(selectedSites.filter((id) => id !== siteId))
    } else {
      onSelect([...selectedSites, siteId])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl  font-bold text-foreground mb-6">Which sites would you like to visit?</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {HERITAGE_SITES.map((site) => (
          <div
            key={site.id}
            className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedSites.includes(site.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleToggle(site.id)}
          >
            <div className="flex gap-4 p-4">
              <Checkbox checked={selectedSites.includes(site.id)} onCheckedChange={() => handleToggle(site.id)} />
              <div className="flex-1">
                <h3 className=" font-bold text-foreground">{site.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{site.location}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{site.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
