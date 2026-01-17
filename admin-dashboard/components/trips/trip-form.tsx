"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { ITrip, IDayPlan } from "@/lib/types"

interface TripFormProps {
  trip?: ITrip | null
  onSave: (trip: Partial<ITrip>) => void
  onCancel: () => void
}

export function TripForm({ trip, onSave, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState<Partial<ITrip>>(
    trip || {
      clerkUserId: "system",
      name: "",
      location: "",
      duration: "",
      image: "",
      description: "",
      highlights: [],
      itinerary: [],
      budget: "Moderate",
      bestTimeToVisit: "",
      isFeatured: false,
      selectedSites: [],
      selectedHotels: [],
      selectedGuides: [],
      selectedExperiences: [],
      isAIGenerated: false,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  )

  const [highlightsInput, setHighlightsInput] = useState(trip?.highlights?.join(", ") || "")
  const [itinerary, setItinerary] = useState<IDayPlan[]>(trip?.itinerary || [])
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const addDay = () => {
    const newDay: IDayPlan = {
      day: (itinerary.length || 0) + 1,
      title: "",
      activities: [],
    }
    setItinerary([...itinerary, newDay])
  }

  const removeDay = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index))
  }

  const updateDay = (index: number, field: string, value: string) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const addActivity = (dayIndex: number) => {
    const updated = [...itinerary]
    updated[dayIndex].activities.push({
      time: "",
      activity: "",
      location: "",
      description: "",
    })
    setItinerary(updated)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updated = [...itinerary]
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== activityIndex)
    setItinerary(updated)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: string) => {
    const updated = [...itinerary]
    updated[dayIndex].activities[activityIndex] = {
      ...updated[dayIndex].activities[activityIndex],
      [field]: value,
    }
    setItinerary(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For featured trips created by admin, use "system" as clerkUserId
    const clerkUserId = formData.isFeatured ? "system" : (formData.clerkUserId || "system")

    const newTrip: Partial<ITrip> = {
      ...(trip?._id && { _id: trip._id }),
      clerkUserId,
      name: formData.name || "",
      location: formData.location || "",
      duration: formData.duration || "",
      image: formData.image || "",
      description: formData.description || "",
      highlights: highlightsInput.split(",").map((h) => h.trim()).filter(Boolean),
      itinerary,
      budget: (formData.budget as "Budget" | "Moderate" | "Luxury") || "Moderate",
      bestTimeToVisit: formData.bestTimeToVisit || "",
      isFeatured: formData.isFeatured || false,
      selectedSites: formData.selectedSites || [],
      selectedHotels: formData.selectedHotels || [],
      selectedGuides: formData.selectedGuides || [],
      selectedExperiences: formData.selectedExperiences || [],
      isAIGenerated: formData.isAIGenerated || false,
      aiPrompt: formData.aiPrompt,
      status: (formData.status as "draft" | "planned" | "booked" | "completed" | "cancelled") || "draft",
      startDate: formData.startDate,
      endDate: formData.endDate,
    }

    onSave(newTrip)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Trip Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Trip name"
            required
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Cities/locations"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <Label htmlFor="duration">Duration *</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration || ""}
            onChange={handleChange}
            placeholder="e.g., 5 Days"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select value={formData.budget || "Moderate"} onValueChange={(value) => handleSelectChange("budget", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Budget">Budget</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status || "draft"} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Best Time to Visit */}
        <div>
          <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
          <Input
            id="bestTimeToVisit"
            name="bestTimeToVisit"
            value={formData.bestTimeToVisit || ""}
            onChange={handleChange}
            placeholder="October to March"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" value={formData.image || ""} onChange={handleChange} placeholder="https://..." />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Trip description"
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="highlights">Highlights (comma-separated)</Label>
        <Textarea
          id="highlights"
          value={highlightsInput}
          onChange={(e) => setHighlightsInput(e.target.value)}
          placeholder="Taj Mahal, Red Fort, City Palace"
          rows={2}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" value={formData.startDate || ""} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="date" value={formData.endDate || ""} onChange={handleChange} />
        </div>
      </div>

      {/* Itinerary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Itinerary</Label>
          <Button type="button" variant="outline" size="sm" onClick={addDay}>
            <Plus className="h-4 w-4 mr-2" />
            Add Day
          </Button>
        </div>

        <div className="space-y-2">
          {itinerary.map((day, dayIndex) => (
            <Collapsible
              key={dayIndex}
              open={expandedDay === dayIndex}
              onOpenChange={() => setExpandedDay(expandedDay === dayIndex ? null : dayIndex)}
            >
              <Card className="p-3">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    <span className="font-semibold">Day {day.day}</span>
                    <span className="text-sm text-muted-foreground">{day.title}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeDay(dayIndex)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4 space-y-3">
                  <Input
                    placeholder="Day title"
                    value={day.title}
                    onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
                  />

                  <div className="space-y-2 pl-2 border-l-2">
                    {day.activities.map((activity, actIndex) => (
                      <Card key={actIndex} className="p-2 bg-muted">
                        <div className="space-y-1">
                          <Input
                            size={30}
                            placeholder="Time (e.g., 9:00 AM)"
                            value={activity.time}
                            onChange={(e) => updateActivity(dayIndex, actIndex, "time", e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Activity"
                            value={activity.activity}
                            onChange={(e) => updateActivity(dayIndex, actIndex, "activity", e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            placeholder="Location"
                            value={activity.location}
                            onChange={(e) => updateActivity(dayIndex, actIndex, "location", e.target.value)}
                            className="text-sm"
                          />
                          <Textarea
                            placeholder="Description (optional)"
                            value={activity.description || ""}
                            onChange={(e) => updateActivity(dayIndex, actIndex, "description", e.target.value)}
                            rows={1}
                            className="text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeActivity(dayIndex, actIndex)}
                            className="w-full mt-1"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove Activity
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addActivity(dayIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={formData.isFeatured || false}
            onCheckedChange={(checked) => handleCheckChange("isFeatured", checked as boolean)}
          />
          <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
            Featured Trip
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAIGenerated"
            checked={formData.isAIGenerated || false}
            onCheckedChange={(checked) => handleCheckChange("isAIGenerated", checked as boolean)}
          />
          <Label htmlFor="isAIGenerated" className="font-normal cursor-pointer">
            AI Generated
          </Label>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Trip</Button>
      </div>
    </form>
  )
}
