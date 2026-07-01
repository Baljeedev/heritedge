"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, X } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { citiesApi, type ICity } from "@/lib/api/cities"
import { toast } from "sonner"
import type { IGuide } from "@/lib/types"

interface GuideFormProps {
  guide?: IGuide | null
  onSave: (guide: Partial<IGuide>) => void
  onCancel: () => void
}

export function GuideForm({ guide, onSave, onCancel }: GuideFormProps) {
  const [formData, setFormData] = useState<Partial<IGuide>>(
    guide || {
      clerkUserId: "",
      name: "",
      image: "",
      specialization: "",
      sites: [],
      cities: [],
      bio: "",
      experience: 0,
      pricePerDay: 0,
      languages: [],
      certifications: [],
      isIntern: false,
      isActive: true,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [languagesInput, setLanguagesInput] = useState(guide?.languages?.join(", ") || "")
  const [certifications, setCertifications] = useState(guide?.certifications || [])
  const [allCities, setAllCities] = useState<ICity[]>([])
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(() => {
    const cities = guide?.cities || []
    return cities.map((city) => (typeof city === "string" ? city : city._id))
  })

  useEffect(() => {
    citiesApi.getAll().then((data) => setAllCities(data.cities)).catch(() => {})
  }, [])

  const toggleCity = (cityId: string) => {
    setSelectedCityIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" || name === "pricePerDay" ? Number(value) : value,
    }))
  }

  const handleCheckChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        issuingAuthority: "",
        certificateNumber: "",
        issueDate: "",
        verified: false,
      },
    ])
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const updateCertification = (index: number, field: string, value: string | boolean) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setCertifications(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCityIds.length === 0) {
      toast.error("Please select at least one city")
      return
    }

    if (!formData.specialization?.trim()) {
      toast.error("Please enter specialization")
      return
    }

    const payload: Partial<IGuide> = {
      clerkUserId: formData.clerkUserId || "",
      name: formData.name || "",
      image: formData.image || "",
      video: formData.video,
      specialization: formData.specialization.trim(),
      sites: guide?.sites || [],
      cities: selectedCityIds,
      bio: formData.bio || "",
      experience: formData.experience || 0,
      pricePerDay: formData.pricePerDay || 0,
      languages: languagesInput.split(",").map((l) => l.trim()).filter(Boolean),
      certifications,
      isIntern: formData.isIntern || false,
      age: formData.age ?? guide?.age,
      internshipStatus: formData.internshipStatus ?? guide?.internshipStatus,
      internshipTestScore: formData.internshipTestScore ?? guide?.internshipTestScore,
      email: formData.email,
      whatsappNumber: formData.whatsappNumber,
      isActive: formData.isActive ?? true,
    }

    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Clerk User ID */}
        <div>
          <Label htmlFor="clerkUserId">Clerk User ID *</Label>
          <Input
            id="clerkUserId"
            name="clerkUserId"
            value={formData.clerkUserId || ""}
            onChange={handleChange}
            placeholder="clerk_xxx"
            required
          />
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Guide name"
            required
          />
        </div>

        {/* Experience */}
        <div>
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            name="experience"
            type="number"
            value={formData.experience || 0}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Price Per Day */}
        <div>
          <Label htmlFor="pricePerDay">Price Per Day *</Label>
          <Input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            value={formData.pricePerDay || 0}
            onChange={handleChange}
            placeholder="3000"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specialization">Specialization *</Label>
        <Input
          id="specialization"
          name="specialization"
          value={formData.specialization || ""}
          onChange={handleChange}
          placeholder="e.g. Mughal Architecture, Hawa Mahal, Delhi Heritage"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Comma-separated areas or monuments this guide specializes in.
        </p>
      </div>

      <div>
        <Label className="mb-2 block">Cities *</Label>
        {selectedCityIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCityIds.map((cityId) => {
              const city = allCities.find((item) => item._id === cityId)
              if (!city) return null
              return (
                <Badge key={cityId} variant="secondary" className="flex items-center gap-1">
                  {city.name}, {city.state}
                  <button type="button" onClick={() => toggleCity(cityId)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
        <div className="max-h-56 overflow-y-auto border border-border rounded-lg divide-y divide-border">
          {allCities.map((city) => (
            <label
              key={city._id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-background cursor-pointer"
            >
              <Checkbox
                checked={selectedCityIds.includes(city._id)}
                onCheckedChange={() => toggleCity(city._id)}
              />
              <span className="text-sm">
                <span className="font-medium">{city.name}</span>
                <span className="text-muted-foreground ml-1">({city.state})</span>
              </span>
            </label>
          ))}
          {allCities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">
              No cities found. Add them in the Cities section.
            </p>
          )}
        </div>
      </div>

      {/* Image */}
      <div>
        <FileUpload
          label="Profile Image"
          value={imageFile || formData.image || null}
          onChange={(file) => setImageFile(file)}
          fileType="image"
        />
      </div>

      {/* Video */}
      <div>
        <FileUpload
          label="Video (Optional)"
          value={videoFile || formData.video || null}
          onChange={(file) => setVideoFile(file)}
          fileType="video"
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio *</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          placeholder="Guide biography"
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="guide@example.com"
        />
      </div>

      <div>
        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
        <Input
          id="whatsappNumber"
          name="whatsappNumber"
          value={formData.whatsappNumber || ""}
          onChange={handleChange}
          placeholder="+91 98765 43210"
        />
      </div>

      <div>
        <Label htmlFor="languages">Languages (comma-separated)</Label>
        <Input
          id="languages"
          value={languagesInput}
          onChange={(e) => setLanguagesInput(e.target.value)}
          placeholder="English, Hindi, Spanish"
        />
      </div>

      {/* Certifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Certifications</Label>
          <Button type="button" variant="outline" size="sm" onClick={addCertification}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Cert name"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Issuing authority"
                  value={cert.issuingAuthority}
                  onChange={(e) => updateCertification(index, "issuingAuthority", e.target.value)}
                />
                <Input
                  placeholder="Certificate number"
                  value={cert.certificateNumber}
                  onChange={(e) => updateCertification(index, "certificateNumber", e.target.value)}
                />
                <Input
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) => updateCertification(index, "issueDate", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Checkbox
                  checked={cert.verified}
                  onCheckedChange={(checked) => updateCertification(index, "verified", checked)}
                />
                <Label className="font-normal">Verified</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(index)}
                  className="ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Intern Fields */}
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="isIntern"
            checked={formData.isIntern || false}
            onCheckedChange={(checked) => handleCheckChange("isIntern", checked as boolean)}
          />
          <Label htmlFor="isIntern" className="font-normal cursor-pointer">
            Is Intern
          </Label>
        </div>

        {formData.isIntern && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="age">Age (13-17)</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="17"
                  value={guide?.age || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: Number(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="internshipStatus">Internship Status</Label>
                <Select
                  value={guide?.internshipStatus || "pending"}
                  onValueChange={(value) => handleSelectChange("internshipStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="internshipTestScore">Test Score (0-100)</Label>
                <Input
                  id="internshipTestScore"
                  type="number"
                  min="0"
                  max="100"
                  value={guide?.internshipTestScore || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, internshipTestScore: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive ?? true}
          onCheckedChange={(checked) => handleCheckChange("isActive", checked as boolean)}
        />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">
          Active Guide
        </Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Guide</Button>
      </div>
    </form>
  )
}
