"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, X, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useHeritageSites } from "@/lib/api"
import type { HeritageSite } from "@/lib/api/heritageSites"

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Debounce search query
  const [debouncedQuery, setDebouncedQuery] = useState("")
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch suggestions when query changes
  const { data, isLoading } = useHeritageSites({
    search: debouncedQuery || undefined,
    limit: 8,
  })

  const suggestions = data?.sites || []

  // Show suggestions when there's a query
  useEffect(() => {
    setShowSuggestions(searchQuery.length > 0 && suggestions.length > 0)
  }, [searchQuery, suggestions.length])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter" && searchQuery.trim()) {
        handleSearch()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSiteSelect(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        searchInputRef.current?.blur()
        break
    }
  }

  // Handle site selection from suggestions
  const handleSiteSelect = (site: HeritageSite) => {
    setSearchQuery("")
    setShowSuggestions(false)
    setSelectedIndex(-1)
    navigate(`/map?site=${site._id}`)
  }

  // Handle search button click
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    if (onSearch) {
      onSearch(searchQuery.trim())
    } else {
      // Default: navigate to map with search query
      navigate(`/map?search=${encodeURIComponent(searchQuery.trim())}`)
    }
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col sm:flex-row gap-3 relative">
      <div className="flex-1 relative">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/50 z-10" />
        <Input
          ref={searchInputRef}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder="Search monuments, historical sites, destinations..."
          className="pl-12 pr-10 h-14 text-base rounded-full border-primary/15 bg-card shadow-[0_4px_24px_oklch(0.42_0.15_35/0.08)] focus-visible:border-primary/40 focus-visible:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("")
              setShowSuggestions(false)
              setSelectedIndex(-1)
              searchInputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-2xl shadow-[0_12px_40px_oklch(0.42_0.15_35/0.12)] z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((site, index) => (
                  <button
                    key={site._id}
                    onClick={() => handleSiteSelect(site)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-start gap-3 ${
                      index === selectedIndex ? "bg-muted" : ""
                    }`}
                  >
                    <div className="shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
                      <img
                        src={site.image || "/placeholder.svg"}
                        alt={site.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {site.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {[site.city, site.state, site.country]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                      {site.era && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {site.era}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : debouncedQuery ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No sites found matching "{debouncedQuery}"
              </div>
            ) : null}
          </div>
        )}
      </div>
      <Button
        onClick={handleSearch}
        className="h-14 rounded-full bg-primary text-primary-foreground px-10 text-base shadow-[0_4px_20px_oklch(0.42_0.15_35/0.3)] hover:shadow-[0_6px_28px_oklch(0.42_0.15_35/0.4)] transition-shadow"
        disabled={!searchQuery.trim()}
      >
        Search
      </Button>
    </div>
  )
}
