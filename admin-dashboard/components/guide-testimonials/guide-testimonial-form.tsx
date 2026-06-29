"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { guidesApi } from "@/lib/api/guides"
import { toast } from "sonner"
import type { IGuide, IGuideTestimonial } from "@/lib/types"

interface GuideTestimonialFormProps {
  testimonial?: IGuideTestimonial | null
  onSave: (data: Partial<IGuideTestimonial>) => void
  onCancel: () => void
}

export function GuideTestimonialForm({ testimonial, onSave, onCancel }: GuideTestimonialFormProps) {
  const [guides, setGuides] = useState<IGuide[]>([])
  const [guideId, setGuideId] = useState(() => {
    const g = testimonial?.guideId
    if (!g) return ""
    return typeof g === "string" ? g : g._id
  })
  const [quote, setQuote] = useState(testimonial?.quote || "")
  const [displayOrder, setDisplayOrder] = useState(testimonial?.displayOrder ?? 0)
  const [isActive, setIsActive] = useState(testimonial?.isActive ?? true)

  useEffect(() => {
    guidesApi.getAll({ all: true, limit: 1000 }).then((d) => setGuides(d.guides)).catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guideId) {
      toast.error("Please select a guide")
      return
    }
    if (!quote.trim()) {
      toast.error("Please enter the testimonial quote")
      return
    }
    onSave({
      guideId,
      quote: quote.trim(),
      displayOrder,
      isActive,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="guideId">Guide *</Label>
        <Select value={guideId} onValueChange={setGuideId}>
          <SelectTrigger id="guideId">
            <SelectValue placeholder="Select a guide" />
          </SelectTrigger>
          <SelectContent>
            {guides.map((guide) => (
              <SelectItem key={guide._id} value={guide._id}>
                {guide.name} — {guide.leadCount ?? 0} leads
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quote">Testimonial *</Label>
        <Textarea
          id="quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="What the guide wants to say..."
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          id="displayOrder"
          type="number"
          min="0"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first on the homepage.</p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked as boolean)}
        />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Active (show on homepage)
        </Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Testimonial</Button>
      </div>
    </form>
  )
}
