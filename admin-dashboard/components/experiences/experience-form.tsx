"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { IExperience } from "@/lib/types"

interface ExperienceFormProps {
  experience?: IExperience | null
  onSave: (experience: Partial<IExperience>) => void
  onCancel: () => void
}

export function ExperienceForm({ experience, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Partial<IExperience>>(
    experience || {
      type: "music",
      name: "",
      image: "",
      video: "",
      sites: [],
      price: 0,
      description: "",
      isActive: true,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  )

  const [performersInput, setPerformersInput] = useState(
    experience?.type === "music" && experience?.performers ? experience.performers.join(", ") : "",
  )
  const [scheduleInput, setScheduleInput] = useState(
    experience?.type === "music" && experience?.schedule ? experience.schedule.join(", ") : "",
  )
  const [topicsInput, setTopicsInput] = useState(
    experience?.type === "workshop" && experience?.topics ? experience.topics.join(", ") : "",
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset type-specific fields when switching types
      ...(name === "type" && {
        duration: undefined,
        venue: undefined,
        performers: undefined,
        genre: undefined,
        schedule: undefined,
        instructor: undefined,
        skillLevel: undefined,
        materialsIncluded: undefined,
        maxParticipants: undefined,
        topics: undefined,
      }),
    }))
  }

  const handleCheckChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const experienceData: Partial<IExperience> = {
      ...formData,
    }

    // Add type-specific fields
    if (formData.type === "music") {
      experienceData.performers = performersInput.split(",").map((p) => p.trim())
      experienceData.schedule = scheduleInput.split(",").map((s) => s.trim())
    } else if (formData.type === "workshop") {
      experienceData.topics = topicsInput.split(",").map((t) => t.trim())
    }

    const newExperience: IExperience = {
      _id: experience?._id || "",
      type: (experienceData.type as "guide" | "music" | "workshop") || "music",
      name: experienceData.name || "",
      image: experienceData.image || "",
      video: experienceData.video || "",
      sites: experienceData.sites || [],
      price: experienceData.price || 0,
      description: experienceData.description || "",
      guideId: experienceData.guideId,
      duration: experienceData.duration,
      venue: experienceData.venue,
      performers: experienceData.performers,
      genre: experienceData.genre,
      schedule: experienceData.schedule,
      instructor: experienceData.instructor,
      skillLevel: experienceData.skillLevel as any,
      materialsIncluded: experienceData.materialsIncluded,
      maxParticipants: experienceData.maxParticipants,
      topics: experienceData.topics,
      isActive: experienceData.isActive ?? true,
      rating: experienceData.rating || 0,
      reviewCount: experienceData.reviewCount || 0,
      createdAt: experienceData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(newExperience)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type */}
      <div>
        <Label htmlFor="type">Experience Type *</Label>
        <Select value={formData.type || "music"} onValueChange={(value) => handleSelectChange("type", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="music">Music Show</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Experience name"
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price || 0}
            onChange={handleChange}
            placeholder="500"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          name="image"
          value={formData.image || ""}
          onChange={handleChange}
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Experience description"
          rows={3}
          required
        />
      </div>

      {/* Music Show Fields */}
      {formData.type === "music" && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Music Show Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={(formData as any).duration || ""}
                onChange={handleChange}
                placeholder="e.g., 90 minutes"
              />
            </div>

            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={(formData as any).venue || ""}
                onChange={handleChange}
                placeholder="Venue name"
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                name="genre"
                value={(formData as any).genre || ""}
                onChange={handleChange}
                placeholder="e.g., Hindustani Classical"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="performers">Performers (comma-separated)</Label>
            <Textarea
              id="performers"
              value={performersInput}
              onChange={(e) => setPerformersInput(e.target.value)}
              placeholder="Artist 1, Artist 2"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="schedule">Schedule (comma-separated)</Label>
            <Textarea
              id="schedule"
              value={scheduleInput}
              onChange={(e) => setScheduleInput(e.target.value)}
              placeholder="Every Friday 7 PM, Every Saturday 8 PM"
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Workshop Fields */}
      {formData.type === "workshop" && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Workshop Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                name="instructor"
                value={(formData as any).instructor || ""}
                onChange={handleChange}
                placeholder="Instructor name"
              />
            </div>

            <div>
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select
                value={(formData as any).skillLevel || "beginner"}
                onValueChange={(value) => handleSelectChange("skillLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                value={(formData as any).maxParticipants || ""}
                onChange={handleChange}
                placeholder="20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="materialsIncluded"
              checked={(formData as any).materialsIncluded || false}
              onCheckedChange={(checked) => handleCheckChange("materialsIncluded", checked as boolean)}
            />
            <Label htmlFor="materialsIncluded" className="font-normal cursor-pointer">
              Materials Included
            </Label>
          </div>

          <div>
            <Label htmlFor="topics">Topics (comma-separated)</Label>
            <Textarea
              id="topics"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="Topic 1, Topic 2"
              rows={2}
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive ?? true}
          onCheckedChange={(checked) => handleCheckChange("isActive", checked as boolean)}
        />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Active Experience
        </Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Experience</Button>
      </div>
    </form>
  )
}
