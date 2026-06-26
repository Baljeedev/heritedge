"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react"
import type { IGuide } from "@/lib/types"
import { GuideForm } from "./guide-form"
import { guidesApi } from "@/lib/api"
import { toast } from "sonner"

const internshipStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
}

export function GuideList() {
  const [guides, setGuides] = useState<IGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [internFilter, setInternFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGuide, setEditingGuide] = useState<IGuide | null>(null)

  // Fetch guides from API
  useEffect(() => {
    loadGuides()
  }, [])

  const loadGuides = async () => {
    try {
      setLoading(true)
      const response = await guidesApi.getAll({ limit: 1000, all: true })
      setGuides(response.guides)
    } catch (error: any) {
      toast.error(`Failed to load guides: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      const matchesSearch =
        guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.specialization.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? guide.isActive : !guide.isActive)

      const matchesIntern = internFilter === "all" || (internFilter === "intern" ? guide.isIntern : !guide.isIntern)

      return matchesSearch && matchesStatus && matchesIntern
    })
  }, [guides, searchTerm, statusFilter, internFilter])

  const handleSave = async (guide: Partial<IGuide>) => {
    try {
      if (editingGuide) {
        await guidesApi.update(editingGuide._id, guide)
        toast.success("Guide updated successfully")
      } else {
        await guidesApi.create(guide)
        toast.success("Guide created successfully")
      }
      setIsFormOpen(false)
      setEditingGuide(null)
      await loadGuides()
    } catch (error: any) {
      toast.error(`Failed to save guide: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) return
    
    try {
      await guidesApi.delete(id)
      toast.success("Guide deleted successfully")
      await loadGuides()
    } catch (error: any) {
      toast.error(`Failed to delete guide: ${error.message}`)
    }
  }

  const handleEdit = (guide: IGuide) => {
    setEditingGuide(guide)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guides</h1>
          <p className="text-muted-foreground mt-1">Manage guides and intern programs</p>
        </div>
        <Button
          onClick={() => {
            setEditingGuide(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Guide
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialization..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={internFilter} onValueChange={setInternFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guides</SelectItem>
              <SelectItem value="intern">Interns</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setInternFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredGuides.length} guides</p>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Guides Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-6 flex items-center justify-center">
              {guide.image && (
                <img
                  src={guide.image || "/placeholder.svg"}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{guide.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{guide.specialization}</p>

              {guide.isIntern && <Badge variant="secondary">Intern - {guide.internshipStatus}</Badge>}
              {!guide.isIntern && <Badge variant="outline">Professional</Badge>}

              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">★ {guide.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">${guide.pricePerDay}/day</span>
                </div>
                <div className="text-sm text-muted-foreground">{guide.experience} years experience</div>
                <div className="text-sm font-medium text-foreground">
                  Leads: {guide.leadCount ?? 0}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {guide.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleEdit(guide)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(guide._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!loading && filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No guides found</p>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGuide ? "Edit Guide" : "Create New Guide"}</DialogTitle>
          </DialogHeader>
          <GuideForm 
            guide={editingGuide} 
            onSave={handleSave} 
            onCancel={() => {
              setIsFormOpen(false)
              setEditingGuide(null)
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
