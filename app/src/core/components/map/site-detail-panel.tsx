"use client"

import { Star, Heart, Share2, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HERITAGE_SITES } from "@/data/heritage-sites"
import { useState } from "react"

interface SiteDetailPanelProps {
  siteId: number
  isSelected: boolean
  onToggleSelect: () => void
}

export function SiteDetailPanel({ siteId, isSelected, onToggleSelect }: SiteDetailPanelProps) {
  const site = HERITAGE_SITES.find((s) => s.id === siteId)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "history">("overview")

  if (!site) return null

  return (
    <div className="flex flex-col h-full">
      {/* Image Gallery */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <img src={site.image || "/placeholder.svg"} alt={site.name} className="object-cover" />
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
            {site.location}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(site.rating) ? "fill-accent text-accent" : "text-border"}`}
                />
              ))}
            </div>
            <span className="font-semibold text-foreground">{site.rating}</span>
            <span className="text-muted-foreground">({site.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-muted p-3 rounded-lg text-center">
              <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Era</p>
              <p className="text-sm font-semibold text-foreground">{site.era}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Users className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Visitors</p>
              <p className="text-sm font-semibold text-foreground">{site.annualVisitors}M</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-foreground">{site.status}</p>
            </div>
          </div>
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
                {site.keyFacts.map((fact, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="mb-6">
            <p className="text-foreground leading-relaxed">{site.historicalWriteup}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4 mb-6">
            {site.topReviews.map((review, i) => (
              <div key={i} className="border-b border-border pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{review.author}</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`w-3 h-3 ${j < review.rating ? "fill-accent text-accent" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
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
