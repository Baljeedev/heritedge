"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react"
import type { IGuide, IGuideTestimonial } from "@/lib/types"
import { guideTestimonialsApi } from "@/lib/api/guide-testimonials"
import { GuideTestimonialForm } from "./guide-testimonial-form"
import { toast } from "sonner"

function getGuideName(testimonial: IGuideTestimonial): string {
  const g = testimonial.guideId
  if (!g) return "Unknown guide"
  return typeof g === "string" ? "Guide" : g.name
}

function getGuideLeadCount(testimonial: IGuideTestimonial): number {
  const g = testimonial.guideId
  if (!g || typeof g === "string") return 0
  return g.leadCount ?? 0
}

export function GuideTestimonialList() {
  const [testimonials, setTestimonials] = useState<IGuideTestimonial[]>([])
  const [totalLeads, setTotalLeads] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<IGuideTestimonial | null>(null)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const response = await guideTestimonialsApi.getAll({ all: true, limit: 1000 })
      setTestimonials(response.testimonials)
      setTotalLeads(response.totalLeads)
    } catch (error: any) {
      toast.error(`Failed to load testimonials: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      const guideName = getGuideName(item).toLowerCase()
      return (
        guideName.includes(searchTerm.toLowerCase()) ||
        item.quote.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [testimonials, searchTerm])

  const handleSave = async (data: Partial<IGuideTestimonial>) => {
    try {
      if (editingTestimonial) {
        await guideTestimonialsApi.update(editingTestimonial._id, data)
        toast.success("Testimonial updated successfully")
      } else {
        await guideTestimonialsApi.create(data)
        toast.success("Testimonial created successfully")
      }
      setIsFormOpen(false)
      setEditingTestimonial(null)
      await loadTestimonials()
    } catch (error: any) {
      toast.error(`Failed to save testimonial: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await guideTestimonialsApi.delete(id)
      toast.success("Testimonial deleted successfully")
      await loadTestimonials()
    } catch (error: any) {
      toast.error(`Failed to delete testimonial: ${error.message}`)
    }
  }

  const handleEdit = (testimonial: IGuideTestimonial) => {
    setEditingTestimonial(testimonial)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guide Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            {filteredTestimonials.length} testimonials · {totalLeads} total leads on site
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTestimonial(null)
            setIsFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by guide or quote..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial._id} className="p-4 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-lg">{getGuideName(testimonial)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getGuideLeadCount(testimonial)} leads
                  </p>
                </div>
                <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                  {testimonial.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex-1 line-clamp-5 mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mb-4">Order: {testimonial.displayOrder}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(testimonial)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(testimonial._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No testimonials found</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <GuideTestimonialForm
            key={editingTestimonial?._id ?? "new"}
            testimonial={editingTestimonial}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingTestimonial(null)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
