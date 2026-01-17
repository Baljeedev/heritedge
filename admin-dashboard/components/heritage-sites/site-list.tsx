"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import type { IHeritageSite } from "@/lib/types"
import { SiteForm } from "./site-form"

const mockSites: IHeritageSite[] = [
  {
    _id: "1",
    name: "Taj Mahal",
    location: "Agra",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    image: "/taj-mahal-mausoleum.png",
    rating: 4.8,
    reviewCount: 5234,
    era: "Mughal",
    status: "Preserved",
    annualVisitors: 7.4,
    description: "Symbol of love and a UNESCO World Heritage Site",
    historicalWriteup: "Built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal",
    keyFacts: ["Built in 1632", "White marble", "UNESCO World Heritage Site"],
    coordinates: { latitude: 27.1751, longitude: 78.0421 },
    unescoWorldHeritage: true,
    yearOfConstruction: "1632",
    creator: "Shah Jahan",
    architecturalStyle: "Mughal",
    materials: ["Marble", "Semi-precious stones"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
]

const statusColors: Record<string, string> = {
  Preserved: "bg-green-100 text-green-700",
  "Under Restoration": "bg-yellow-100 text-yellow-700",
  "At Risk": "bg-red-100 text-red-700",
  Ruins: "bg-gray-100 text-gray-700",
}

export function SiteList() {
  const [sites, setSites] = useState<IHeritageSite[]>(mockSites)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [unescoFilter, setUnescoFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<IHeritageSite | null>(null)

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesSearch =
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.city?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || site.status === statusFilter
      const matchesUnesco =
        unescoFilter === "all" || (unescoFilter === "yes" ? site.unescoWorldHeritage : !site.unescoWorldHeritage)

      return matchesSearch && matchesStatus && matchesUnesco
    })
  }, [sites, searchTerm, statusFilter, unescoFilter])

  const handleSave = (site: IHeritageSite) => {
    if (editingSite) {
      setSites(sites.map((s) => (s._id === editingSite._id ? site : s)))
    } else {
      setSites([...sites, { ...site, _id: Date.now().toString() }])
    }
    setIsFormOpen(false)
    setEditingSite(null)
  }

  const handleDelete = (id: string) => {
    setSites(sites.filter((s) => s._id !== id))
  }

  const handleEdit = (site: IHeritageSite) => {
    setEditingSite(site)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Heritage Sites</h1>
          <p className="text-muted-foreground mt-1">Manage heritage sites database</p>
        </div>
        <Button
          onClick={() => {
            setEditingSite(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Site
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Preserved">Preserved</SelectItem>
              <SelectItem value="Under Restoration">Under Restoration</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
              <SelectItem value="Ruins">Ruins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={unescoFilter} onValueChange={setUnescoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="UNESCO Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              <SelectItem value="yes">UNESCO World Heritage</SelectItem>
              <SelectItem value="no">Non-UNESCO</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setUnescoFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredSites.length} sites</p>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <Card key={site._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted overflow-hidden">
              <img src={site.image || "/placeholder.svg"} alt={site.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{site.name}</h3>
                {site.unescoWorldHeritage && <Badge variant="secondary">UNESCO</Badge>}
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {site.city}, {site.state}
              </p>

              <div className="space-y-2 mb-4">
                <Badge className={statusColors[site.status]}>{site.status}</Badge>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">★ {site.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">{site.reviewCount} reviews</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleEdit(site)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(site._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSite ? "Edit Heritage Site" : "Create New Heritage Site"}</DialogTitle>
          </DialogHeader>
          <SiteForm site={editingSite} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
