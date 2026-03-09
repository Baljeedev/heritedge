"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { uploadApi } from "@/lib/api/upload"
import { instrumentsApi, type IInstrument } from "@/lib/api/instruments"
import { artFormsApi, type IArtForm } from "@/lib/api/art-forms"
import { citiesApi, type ICity } from "@/lib/api/cities"
import { toast } from "sonner"
import { X } from "lucide-react"
import type { IExperience } from "@/lib/types"

interface ExperienceFormProps {
  experience?: IExperience | null
  onSave: (experience: Partial<IExperience>) => void
  onCancel: () => void
}

export function ExperienceForm({ experience, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Partial<IExperience>>(
    experience || { type: "music", name: "", image: "", video: "", sites: [], price: 0, description: "", isActive: true, rating: 0, reviewCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [performersInput, setPerformersInput] = useState(experience?.type === "music" && experience?.performers ? experience.performers.join(", ") : "")
  const [scheduleInput, setScheduleInput] = useState(experience?.type === "music" && experience?.schedule ? experience.schedule.join(", ") : "")
  const [topicsInput, setTopicsInput] = useState(experience?.type === "workshop" && experience?.topics ? experience.topics.join(", ") : "")

  // Entity data
  const [allInstruments, setAllInstruments] = useState<IInstrument[]>([])
  const [allArtForms, setAllArtForms] = useState<IArtForm[]>([])
  const [allCities, setAllCities] = useState<ICity[]>([])

  // Selected ids
  const [selectedInstrumentIds, setSelectedInstrumentIds] = useState<string[]>(
    () => {
      const insts = (experience as any)?.instruments || []
      return insts.map((i: any) => typeof i === "string" ? i : i._id)
    }
  )
  const [selectedArtFormIds, setSelectedArtFormIds] = useState<string[]>(
    () => {
      const afs = (experience as any)?.artForms || []
      return afs.map((a: any) => typeof a === "string" ? a : a._id)
    }
  )
  const [selectedCityId, setSelectedCityId] = useState<string>(
    () => {
      const c = (experience as any)?.city
      if (!c) return ""
      return typeof c === "string" ? c : c._id
    }
  )
  const [selectedWorkshopCityId, setSelectedWorkshopCityId] = useState<string>(
    () => {
      const c = (experience as any)?.workshopCity
      if (!c) return ""
      return typeof c === "string" ? c : c._id
    }
  )

  useEffect(() => {
    instrumentsApi.getAll().then(d => setAllInstruments(d.instruments)).catch(() => {})
    artFormsApi.getAll().then(d => setAllArtForms(d.artForms)).catch(() => {})
    citiesApi.getAll().then(d => setAllCities(d.cities)).catch(() => {})
  }, [])

  const toggleInstrument = (id: string) => setSelectedInstrumentIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const toggleArtForm = (id: string) => setSelectedArtFormIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === "price" ? Number(value) : value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev, [name]: value,
      ...(name === "type" && { duration: undefined, venue: undefined, performers: undefined, genre: undefined, schedule: undefined, instructor: undefined, skillLevel: undefined, materialsIncluded: undefined, maxParticipants: undefined, topics: undefined }),
    }))
  }

  const handleCheckChange = (name: string, checked: boolean) => setFormData(prev => ({ ...prev, [name]: checked }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrl = formData.image || ""
    let videoUrl = formData.video || ""

    if (imageFile) {
      try { const r = await uploadApi.upload("experience", imageFile); imageUrl = r.url }
      catch (error: any) { toast.error(`Failed to upload image: ${error.message}`); return }
    }
    if (videoFile) {
      try { const r = await uploadApi.upload("experience", videoFile); videoUrl = r.url }
      catch (error: any) { toast.error(`Failed to upload video: ${error.message}`); return }
    }

    const experienceData: any = {
      ...(experience?._id && { _id: experience._id }),
      type: formData.type || "music",
      name: formData.name || "",
      image: imageUrl, video: videoUrl,
      sites: formData.sites || [],
      price: formData.price || 0,
      description: formData.description || "",
      guideId: formData.guideId,
      email: formData.email,
      isActive: formData.isActive ?? true,
    }

    if (formData.type === "music") {
      experienceData.duration = (formData as any).duration
      experienceData.venue = (formData as any).venue
      experienceData.genre = (formData as any).genre
      experienceData.performers = performersInput.split(",").map(p => p.trim()).filter(Boolean)
      experienceData.schedule = scheduleInput.split(",").map(s => s.trim()).filter(Boolean)
      experienceData.instruments = selectedInstrumentIds
      experienceData.city = selectedCityId || undefined
    } else if (formData.type === "workshop") {
      experienceData.instructor = (formData as any).instructor
      experienceData.skillLevel = (formData as any).skillLevel
      experienceData.materialsIncluded = (formData as any).materialsIncluded
      experienceData.maxParticipants = (formData as any).maxParticipants
      experienceData.topics = topicsInput.split(",").map(t => t.trim()).filter(Boolean)
      experienceData.artForms = selectedArtFormIds
      experienceData.workshopCity = selectedWorkshopCityId || undefined
    }

    onSave(experienceData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type */}
      <div>
        <Label>Experience Type *</Label>
        <Select value={formData.type || "music"} onValueChange={v => handleSelectChange("type", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="music">Music Show</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Name *</Label><Input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Experience name" required /></div>
        <div><Label>Price *</Label><Input name="price" type="number" value={formData.price || 0} onChange={handleChange} placeholder="500" required /></div>
      </div>

      <FileUpload label="Image *" value={imageFile || formData.image || null} onChange={file => setImageFile(file)} fileType="image" />
      <FileUpload label="Video (Optional)" value={videoFile || formData.video || null} onChange={file => setVideoFile(file)} fileType="video" />

      <div><Label>Description *</Label><Textarea name="description" value={formData.description || ""} onChange={handleChange} placeholder="Experience description" rows={3} required /></div>
      <div><Label>Email</Label><Input name="email" type="email" value={formData.email || ""} onChange={handleChange} placeholder="contact@example.com" /></div>

      {/* Music Show Fields */}
      {formData.type === "music" && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Music Show Details</h3>

          {/* City */}
          <div>
            <Label>City</Label>
            <Select value={selectedCityId} onValueChange={setSelectedCityId}>
              <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">No city</SelectItem>
                {allCities.map(c => <SelectItem key={c._id} value={c._id}>{c.name}, {c.state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Instruments */}
          <div>
            <Label className="mb-2 block">Instruments</Label>
            {selectedInstrumentIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedInstrumentIds.map(id => {
                  const inst = allInstruments.find(i => i._id === id)
                  return inst ? (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {inst.name}
                      <button type="button" onClick={() => toggleInstrument(id)}><X className="h-3 w-3" /></button>
                    </Badge>
                  ) : null
                })}
              </div>
            )}
            <div className="max-h-36 overflow-y-auto border border-border rounded-lg divide-y divide-border">
              {allInstruments.map(inst => (
                <label key={inst._id} className="flex items-center gap-3 px-3 py-2 hover:bg-background cursor-pointer">
                  <Checkbox checked={selectedInstrumentIds.includes(inst._id)} onCheckedChange={() => toggleInstrument(inst._id)} />
                  <span className="text-sm"><span className="font-medium">{inst.name}</span><span className="text-muted-foreground ml-1">({inst.category})</span></span>
                </label>
              ))}
              {allInstruments.length === 0 && <p className="text-sm text-muted-foreground text-center py-3">No instruments found. Add them in the Instruments section.</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Duration</Label><Input name="duration" value={(formData as any).duration || ""} onChange={handleChange} placeholder="e.g., 90 minutes" /></div>
            <div><Label>Venue</Label><Input name="venue" value={(formData as any).venue || ""} onChange={handleChange} placeholder="Venue name" /></div>
            <div><Label>Genre</Label><Input name="genre" value={(formData as any).genre || ""} onChange={handleChange} placeholder="e.g., Hindustani Classical" /></div>
          </div>
          <div><Label>Performers (comma-separated)</Label><Textarea value={performersInput} onChange={e => setPerformersInput(e.target.value)} placeholder="Artist 1, Artist 2" rows={2} /></div>
          <div><Label>Schedule (comma-separated)</Label><Textarea value={scheduleInput} onChange={e => setScheduleInput(e.target.value)} placeholder="Every Friday 7 PM, Every Saturday 8 PM" rows={2} /></div>
        </div>
      )}

      {/* Workshop Fields */}
      {formData.type === "workshop" && (
        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Workshop Details</h3>

          {/* City */}
          <div>
            <Label>City</Label>
            <Select value={selectedWorkshopCityId} onValueChange={setSelectedWorkshopCityId}>
              <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">No city</SelectItem>
                {allCities.map(c => <SelectItem key={c._id} value={c._id}>{c.name}, {c.state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Art Forms */}
          <div>
            <Label className="mb-2 block">Art Forms</Label>
            {selectedArtFormIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedArtFormIds.map(id => {
                  const af = allArtForms.find(a => a._id === id)
                  return af ? (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                      {af.name}
                      <button type="button" onClick={() => toggleArtForm(id)}><X className="h-3 w-3" /></button>
                    </Badge>
                  ) : null
                })}
              </div>
            )}
            <div className="max-h-36 overflow-y-auto border border-border rounded-lg divide-y divide-border">
              {allArtForms.map(af => (
                <label key={af._id} className="flex items-center gap-3 px-3 py-2 hover:bg-background cursor-pointer">
                  <Checkbox checked={selectedArtFormIds.includes(af._id)} onCheckedChange={() => toggleArtForm(af._id)} />
                  <span className="text-sm"><span className="font-medium">{af.name}</span><span className="text-muted-foreground ml-1">({af.category})</span></span>
                </label>
              ))}
              {allArtForms.length === 0 && <p className="text-sm text-muted-foreground text-center py-3">No art forms found. Add them in the Art Forms section.</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Instructor</Label><Input name="instructor" value={(formData as any).instructor || ""} onChange={handleChange} placeholder="Instructor name" /></div>
            <div>
              <Label>Skill Level</Label>
              <Select value={(formData as any).skillLevel || "beginner"} onValueChange={v => handleSelectChange("skillLevel", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Max Participants</Label><Input name="maxParticipants" type="number" value={(formData as any).maxParticipants || ""} onChange={handleChange} placeholder="20" /></div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="materialsIncluded" checked={(formData as any).materialsIncluded || false} onCheckedChange={checked => handleCheckChange("materialsIncluded", checked as boolean)} />
            <Label htmlFor="materialsIncluded" className="font-normal cursor-pointer">Materials Included</Label>
          </div>
          <div><Label>Topics (comma-separated)</Label><Textarea value={topicsInput} onChange={e => setTopicsInput(e.target.value)} placeholder="Topic 1, Topic 2" rows={2} /></div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox id="isActive" checked={formData.isActive ?? true} onCheckedChange={checked => handleCheckChange("isActive", checked as boolean)} />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">Active Experience</Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Experience</Button>
      </div>
    </form>
  )
}
