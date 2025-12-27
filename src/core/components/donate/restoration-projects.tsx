"use client"

import { TrendingUp, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const RESTORATION_PROJECTS = [
  {
    id: 1,
    name: "Taj Mahal Marble Restoration",
    location: "Agra, India",
    image: "/placeholder.svg?key=restore1",
    description:
      "Restore the intricate marble inlay work and clean the exterior facade affected by pollution and weathering.",
    fundingGoal: 500000,
    fundingRaised: 287500,
    donors: 1247,
    timeline: "18 months",
    impact: "Preserves architectural integrity and creates 120 local jobs",
  },
  {
    id: 2,
    name: "Machu Picchu Archaeological Survey",
    location: "Peru",
    image: "/placeholder.svg?key=restore2",
    description: "Comprehensive archaeological survey and structural reinforcement of Incan terraces and buildings.",
    fundingGoal: 350000,
    fundingRaised: 198000,
    donors: 892,
    timeline: "12 months",
    impact: "Strengthens structures and trains 80 local archaeologists",
  },
  {
    id: 3,
    name: "Colosseum Restoration Phase 2",
    location: "Rome, Italy",
    image: "/placeholder.svg?key=restore3",
    description: "Continued restoration of upper tiers and implementation of advanced conservation technologies.",
    fundingGoal: 750000,
    fundingRaised: 625000,
    donors: 3421,
    timeline: "24 months",
    impact: "Ensures longevity and supports 200 conservators",
  },
  {
    id: 4,
    name: "Great Wall Structural Reinforcement",
    location: "China",
    image: "/placeholder.svg?key=restore4",
    description: "Repair eroded sections and reinforce weak points while maintaining authentic construction methods.",
    fundingGoal: 600000,
    fundingRaised: 412000,
    donors: 1856,
    timeline: "20 months",
    impact: "Protects 50km of wall and creates 150 skilled jobs",
  },
]

interface RestorationProjectsProps {
  onSelectProject: (projectId: number) => void
}

export function RestorationProjects({ onSelectProject }: RestorationProjectsProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Active Restoration Projects</h2>
        <p className="text-muted-foreground mb-12">Support ongoing preservation efforts at heritage sites worldwide</p>

        <div className="grid md:grid-cols-2 gap-8">
          {RESTORATION_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all"
            >
              {/* Image */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  // fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{project.location}</p>
                <p className="text-sm text-foreground mb-4">{project.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Funding Progress</span>
                    <span className="text-xs font-semibold text-primary">
                      {Math.round((project.fundingRaised / project.fundingGoal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(project.fundingRaised / project.fundingGoal) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>${(project.fundingRaised / 1000).toFixed(0)}K raised</span>
                    <span>${(project.fundingGoal / 1000).toFixed(0)}K goal</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-xs border-t border-b border-border py-3">
                  <div className="text-center">
                    <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-muted-foreground">{project.donors.toLocaleString()} donors</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-muted-foreground">{project.timeline}</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-muted-foreground">Active</p>
                  </div>
                </div>

                {/* Impact */}
                <div className="bg-primary/5 border border-primary/20 rounded p-3 mb-4">
                  <p className="text-xs font-semibold text-primary mb-1">Your Impact</p>
                  <p className="text-xs text-muted-foreground">{project.impact}</p>
                </div>

                {/* Button */}
                <Button
                  onClick={() => onSelectProject(project.id)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Donate to Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
