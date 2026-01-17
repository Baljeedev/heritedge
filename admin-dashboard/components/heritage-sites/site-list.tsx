"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react"
import type { IHeritageSite } from "@/lib/types"
import { SiteForm } from "./site-form"
import { heritageSitesApi } from "@/lib/api"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  Preserved: "bg-green-100 text-green-700",
  "Under Restoration": "bg-yellow-100 text-yellow-700",
  "At Risk": "bg-red-100 text-red-700",
  Ruins: "bg-gray-100 text-gray-700",
}

export function SiteList() {
  const [sites, setSites] = useState<IHeritageSite[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [unescoFilter, setUnescoFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<IHeritageSite | null>(null)

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    try {
      setLoading(true)
      const response = await heritageSitesApi.getAll({ limit: 1000 })
      setSites(response.sites)
    } catch (error: any) {
      toast.error(`Failed to load heritage sites: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSave = async (site: Partial<IHeritageSite>) => {
    try {
      if (editingSite) {
        await heritageSitesApi.update(editingSite._id, site)
        toast.success("Heritage site updated successfully")
      } else {
        await heritageSitesApi.create(site)
        toast.success("Heritage site created successfully")
      }
      setIsFormOpen(false)
      setEditingSite(null)
      await loadSites()
    } catch (error: any) {
      toast.error(`Failed to save heritage site: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this heritage site?")) return
    
    try {
      await heritageSitesApi.delete(id)
      toast.success("Heritage site deleted successfully")
      await loadSites()
    } catch (error: any) {
      toast.error(`Failed to delete heritage site: ${error.message}`)
    }
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
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">UNESCO Sites</SelectItem>
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Sites Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <Card key={site._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted overflow-hidden">
              <img src={site.image || "/placeholder.svg"} alt={site.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{site.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{site.location}</p>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <Badge className={statusColors[site.status]}>{site.status}</Badge>
                  {site.unescoWorldHeritage && <Badge variant="secondary">UNESCO</Badge>}
                </div>
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
      )}

      {/* Empty State */}
      {!loading && filteredSites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No heritage sites found</p>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSite ? "Edit Heritage Site" : "Create New Heritage Site"}</DialogTitle>
          </DialogHeader>
          <SiteForm 
            site={editingSite} 
            onSave={handleSave} 
            onCancel={() => {
              setIsFormOpen(false)
              setEditingSite(null)
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}