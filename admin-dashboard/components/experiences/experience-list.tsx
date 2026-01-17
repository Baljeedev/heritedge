"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import type { IExperience } from "@/lib/types"
import { ExperienceForm } from "./experience-form"

const mockExperiences: IExperience[] = [
  {
    _id: "1",
    type: "music",
    name: "Classical Hindustani Music Show",
    image: "/music-show-placeholder.png",
    video: "",
    sites: [],
    rating: 4.6,
    reviewCount: 89,
    price: 500,
    description: "Live classical music performance by renowned artists",
    duration: "90 minutes",
    venue: "Taj Convention Hall",
    genre: "Hindustani Classical",
    performers: ["Ravi Shankar Jr.", "Zakir Hussain"],
    schedule: ["Every Friday 7 PM", "Every Saturday 8 PM"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
]

const typeColors: Record<string, string> = {
  music: "bg-purple-100 text-purple-700",
  workshop: "bg-blue-100 text-blue-700",
  guide: "bg-amber-100 text-amber-700",
}

export function ExperienceList() {
  const [experiences, setExperiences] = useState<IExperience[]>(mockExperiences)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<IExperience | null>(null)

  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || exp.type === typeFilter
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? exp.isActive : !exp.isActive)

      return matchesSearch && matchesType && matchesStatus
    })
  }, [experiences, searchTerm, typeFilter, statusFilter])

  const handleSave = (experience: IExperience) => {
    if (editingExperience) {
      setExperiences(experiences.map((e) => (e._id === editingExperience._id ? experience : e)))
    } else {
      setExperiences([...experiences, { ...experience, _id: Date.now().toString() }])
    }
    setIsFormOpen(false)
    setEditingExperience(null)
  }

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter((e) => e._id !== id))
  }

  const handleEdit = (experience: IExperience) => {
    setEditingExperience(experience)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experiences</h1>
          <p className="text-muted-foreground mt-1">Manage music shows and workshops</p>
        </div>
        <Button
          onClick={() => {
            setEditingExperience(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Experience
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="music">Music Show</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
            </SelectContent>
          </Select>
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
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setTypeFilter("all")
              setStatusFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">Showing {filteredExperiences.length} experiences</p>

      {/* Experiences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiences.map((experience) => (
          <Card key={experience._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={experience.image || "/placeholder.svg"}
                alt={experience.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{experience.name}</h3>
              </div>

              <div className="mb-3">
                <Badge className={typeColors[experience.type]}>
                  {experience.type === "music" ? "🎵 Music" : "🎨 Workshop"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{experience.description}</p>

              {experience.type === "music" && (
                <div className="text-sm text-muted-foreground mb-2">
                  <div>
                    {experience.duration} • {experience.venue}
                  </div>
                  <div className="text-xs mt-1">Genre: {experience.genre}</div>
                </div>
              )}

              {experience.type === "workshop" && (
                <div className="text-sm text-muted-foreground mb-2">
                  <div>Instructor: {experience.instructor}</div>
                  <div className="text-xs mt-1">Level: {experience.skillLevel}</div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm my-3 py-3 border-t border-border">
                <span className="text-muted-foreground">★ {experience.rating.toFixed(1)}</span>
                <span className="font-bold">₹{experience.price}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEdit(experience)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(experience._id)}>
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
            <DialogTitle>{editingExperience ? "Edit Experience" : "Create New Experience"}</DialogTitle>
          </DialogHeader>
          <ExperienceForm experience={editingExperience} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
