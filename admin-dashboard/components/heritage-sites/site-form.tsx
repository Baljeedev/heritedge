"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { IHeritageSite } from "@/lib/types"

interface SiteFormProps {
  site?: IHeritageSite | null
  onSave: (site: Partial<IHeritageSite>) => void
  onCancel: () => void
}

export function SiteForm({ site, onSave, onCancel }: SiteFormProps) {
  const [formData, setFormData] = useState<Partial<IHeritageSite>>(
    site || {
      name: "",
      location: "",
      city: "",
      state: "",
      country: "India",
      image: "",
      description: "",
      historicalWriteup: "",
      era: "",
      status: "Preserved",
      keyFacts: [],
      materials: [],
      coordinates: { latitude: 0, longitude: 0 },
      unescoWorldHeritage: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  )

  const [keyFactsInput, setKeyFactsInput] = useState(site?.keyFacts?.join(", ") || "")
  const [materialsInput, setMaterialsInput] = useState(site?.materials?.join(", ") || "")

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

  const handleCoordinateChange = (field: "latitude" | "longitude", value: string) => {
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSite: IHeritageSite = {
      _id: site?._id || "",
      name: formData.name || "",
      location: formData.location || "",
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "India",
      image: formData.image || "",
      description: formData.description || "",
      historicalWriteup: formData.historicalWriteup || "",
      era: formData.era || "",
      status: (formData.status as "Preserved" | "Under Restoration" | "At Risk" | "Ruins") || "Preserved",
      keyFacts: keyFactsInput.split(",").map((f) => f.trim()),
      materials: materialsInput.split(",").map((m) => m.trim()),
      coordinates: formData.coordinates || { latitude: 0, longitude: 0 },
      unescoWorldHeritage: formData.unescoWorldHeritage || false,
      rating: formData.rating || 0,
      reviewCount: formData.reviewCount || 0,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(newSite)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Heritage site name"
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
            placeholder="Specific location"
            required
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" />
        </div>

        {/* State */}
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" value={formData.state || ""} onChange={handleChange} placeholder="State" />
        </div>

        {/* Era */}
        <div>
          <Label htmlFor="era">Era *</Label>
          <Input
            id="era"
            name="era"
            value={formData.era || ""}
            onChange={handleChange}
            placeholder="e.g., Mughal, Rajput"
            required
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status || "Preserved"} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Preserved">Preserved</SelectItem>
              <SelectItem value="Under Restoration">Under Restoration</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
              <SelectItem value="Ruins">Ruins</SelectItem>
            </SelectContent>
          </Select>
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
          placeholder="Brief description"
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="historicalWriteup">Historical Write-up *</Label>
        <Textarea
          id="historicalWriteup"
          name="historicalWriteup"
          value={formData.historicalWriteup || ""}
          onChange={handleChange}
          placeholder="Detailed historical information"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={formData.coordinates?.latitude || ""}
            onChange={(e) => handleCoordinateChange("latitude", e.target.value)}
            placeholder="0.0000"
          />
        </div>

        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={formData.coordinates?.longitude || ""}
            onChange={(e) => handleCoordinateChange("longitude", e.target.value)}
            placeholder="0.0000"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="keyFacts">Key Facts (comma-separated)</Label>
          <Textarea
            id="keyFacts"
            value={keyFactsInput}
            onChange={(e) => setKeyFactsInput(e.target.value)}
            placeholder="Fact 1, Fact 2, Fact 3"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="materials">Materials (comma-separated)</Label>
          <Textarea
            id="materials"
            value={materialsInput}
            onChange={(e) => setMaterialsInput(e.target.value)}
            placeholder="Material 1, Material 2"
            rows={2}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="unesco"
          checked={formData.unescoWorldHeritage || false}
          onCheckedChange={(checked) => handleCheckChange("unescoWorldHeritage", checked as boolean)}
        />
        <Label htmlFor="unesco" className="font-normal cursor-pointer">
          UNESCO World Heritage Site
        </Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Heritage Site</Button>
      </div>
    </form>
  )
}
