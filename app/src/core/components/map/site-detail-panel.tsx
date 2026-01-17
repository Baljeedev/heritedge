"use client"

import { Star, Heart, Share2, MapPin, Calendar, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHeritageSite } from "@/lib/api"
import { useState, useEffect } from "react"
import axios from "axios"


interface SiteDetailPanelProps {
  siteId: string
  isSelected: boolean
  onToggleSelect: () => void
}

interface SiteInfoFromBackend {
  creator: string 
  era: string
  location: string
  status: string
  stoneUsed: string
  visitors: number
  yearOfConstruction: number
}

export function SiteDetailPanel({ siteId, isSelected, onToggleSelect }: SiteDetailPanelProps) {
  const { data: site, isLoading, error } = useHeritageSite(siteId)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "history">("overview")

  const [ information, setInformation ] = useState<SiteInfoFromBackend | null>(null)

  const getInformationFromBackend = async () => {
    const response = await axios.get("http://localhost:3000/information")

    setInformation(response.data)
  }
  
  useEffect(() => {
    // console.log("useeffect was run")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getInformationFromBackend()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading site details...</p>
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Unable to load site details</p>
          <p className="text-sm text-muted-foreground">Please try selecting another site</p>
        </div>
      </div>
    )
  }

  
  return (
    <div className="flex flex-col h-full">
      {/* Image Gallery */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <img 
          src={site.images?.[0] || "/placeholder.svg"} 
          alt={site.name} 
          className="w-full h-full object-cover" 
        />
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all">
          <Heart className={`w-5 h-5 ${isSelected ? "fill-red-500 text-red-500" : "text-foreground"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">{site.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            {site.city}, {site.state || site.country}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(site.rating || 0) ? "fill-accent text-accent" : "text-border"}`}
                />
              ))}
            </div>
            <span className="font-semibold text-foreground">{site.rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-muted-foreground">({(site.reviewCount || 0).toLocaleString()} reviews)</span>
          </div>

          {/* Quick Info */}
          {/* ternary operator */}
          {/* condition ? component to show if condition is true : component to show if condition is false */}
          {
            information == null ? (
              <div>loading...</div>
            ) : (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-muted p-3 rounded-lg text-center">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Era</p>
                  <p className="text-sm font-semibold text-foreground">{site.historicalPeriod || information?.era || 'N/A'}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Visitors</p>
                  <p className="text-sm font-semibold text-foreground">{site.annualVisitors || information?.visitors || 'N/A'}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-foreground">{site.status || information?.status || 'Active'}</p>
                </div>
              </div>
            )
          }
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border mb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "overview"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "history"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "reviews"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4 mb-6">
            <p className="text-foreground leading-relaxed">{site.description}</p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Key Facts</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>UNESCO World Heritage: {site.unescoWorldHeritage ? 'Yes' : 'No'}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Historical Period: {site.historicalPeriod || 'Unknown'}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Annual Visitors: {site.annualVisitors || 'Not available'}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Status: {site.status || 'Active'}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="mb-6">
            <p className="text-foreground leading-relaxed">
              {site.historicalSignificance || site.description || 'Historical information not available.'}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 mb-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Reviews feature coming soon!</p>
              <p className="text-sm text-muted-foreground mt-2">
                Connect with our reviews API to see visitor experiences
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border p-6 space-y-3 bg-card">
        <Button
          onClick={onToggleSelect}
          className={`w-full ${
            isSelected
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isSelected ? "✓ Selected for Trip" : "+ Add to Trip"}
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <Share2 className="w-4 h-4 mr-2" />
          Share Site
        </Button>
      </div>
    </div>
  )
}
