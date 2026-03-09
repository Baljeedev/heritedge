"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, X } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { uploadApi } from "@/lib/api/upload"
import { heritageSitesApi } from "@/lib/api/heritage-sites"
import { toast } from "sonner"
import type { IHotel, IHeritageSite } from "@/lib/types"

interface HotelFormProps {
  hotel?: IHotel | null
  onSave: (hotel: Partial<IHotel>) => void
  onCancel: () => void
}

export function HotelForm({ hotel, onSave, onCancel }: HotelFormProps) {
  const [formData, setFormData] = useState<Partial<IHotel>>(
    hotel || {
      name: "", chain: "", location: "", city: "", state: "", country: "India",
      coordinates: { latitude: 0, longitude: 0 },
      images: [], pricePerNight: { min: 0, max: 0, currency: "INR" },
      description: "", amenities: [], roomTypes: [],
      heritageFeatures: { hasLivingHistoryRooms: false, hasHistoryLectures: false, hasCulturalMeals: false, hasStorytellingEvenings: false },
      nearbySites: [], partnershipType: "listing", discountPercentage: 0,
      isActive: true, rating: 0, reviewCount: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
  )

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [amenitiesInput, setAmenitiesInput] = useState(hotel?.amenities?.join(", ") || "")
  const [roomTypes, setRoomTypes] = useState(hotel?.roomTypes || [])

  // Heritage sites for nearbySites selector
  const [allSites, setAllSites] = useState<IHeritageSite[]>([])
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>(
    () => {
      const sites = hotel?.nearbySites || []
      return sites.map((s) => (typeof s === "string" ? s : (s as IHeritageSite)._id))
    }
  )
  const [siteSearch, setSiteSearch] = useState("")

  useEffect(() => {
    heritageSitesApi.getAll({ limit: 200 }).then(d => setAllSites(d.sites)).catch(() => {})
  }, [])

  const filteredSites = allSites.filter(s =>
    s.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
    (s.city || "").toLowerCase().includes(siteSearch.toLowerCase())
  )

  const toggleSite = (siteId: string) => {
    setSelectedSiteIds(prev =>
      prev.includes(siteId) ? prev.filter(id => id !== siteId) : [...prev, siteId]
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes("price")) {
      const subfield = name.split(".")[1]
      setFormData(prev => ({ ...prev, pricePerNight: { ...prev.pricePerNight, [subfield]: Number(value) } }))
    } else if (name.includes("coordinates")) {
      const subfield = name.split(".")[1]
      setFormData(prev => ({ ...prev, coordinates: { ...prev.coordinates, [subfield]: Number(value) } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckChange = (name: string, checked: boolean) => {
    if (name.includes("heritageFeatures")) {
      const feature = name.split(".")[1]
      setFormData(prev => ({ ...prev, heritageFeatures: { ...prev.heritageFeatures, [feature]: checked } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }))
    }
  }

  const addRoomType = () => setRoomTypes([...roomTypes, { name: "", description: "", pricePerNight: 0, maxOccupancy: 1, isLivingHistory: false }])
  const removeRoomType = (index: number) => setRoomTypes(roomTypes.filter((_, i) => i !== index))
  const updateRoomType = (index: number, field: string, value: string | number | boolean) => {
    const updated = [...roomTypes]
    updated[index] = { ...updated[index], [field]: field === "pricePerNight" || field === "maxOccupancy" ? Number(value) : value }
    setRoomTypes(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let imageUrls = formData.images || []
    if (imageFiles.length > 0) {
      try {
        const uploadResult = await uploadApi.uploadMultiple("hotel", imageFiles)
        imageUrls = [...imageUrls, ...uploadResult.files.map(f => f.url)]
      } catch (error: any) {
        toast.error(`Failed to upload images: ${error.message}`)
        return
      }
    }

    const newHotel: Partial<IHotel> = {
      ...(hotel?._id && { _id: hotel._id }),
      name: formData.name || "", chain: formData.chain || "",
      location: formData.location || "", city: formData.city || "",
      state: formData.state || "", country: formData.country || "India",
      coordinates: formData.coordinates || { latitude: 0, longitude: 0 },
      images: imageUrls,
      pricePerNight: formData.pricePerNight || { min: 0, max: 0, currency: "INR" },
      description: formData.description || "",
      amenities: amenitiesInput.split(",").map(a => a.trim()).filter(Boolean),
      roomTypes,
      heritageFeatures: formData.heritageFeatures || { hasLivingHistoryRooms: false, hasHistoryLectures: false, hasCulturalMeals: false, hasStorytellingEvenings: false },
      nearbySites: selectedSiteIds,
      partnershipType: (formData.partnershipType as "listing" | "referral" | "premium") || "listing",
      listingFee: formData.listingFee, referralFee: formData.referralFee,
      discountPercentage: formData.discountPercentage || 0,
      email: formData.email, isActive: formData.isActive ?? true,
      rating: formData.rating || 0, reviewCount: formData.reviewCount || 0,
      createdAt: formData.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    onSave(newHotel)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="name">Hotel Name *</Label><Input id="name" name="name" value={formData.name || ""} onChange={handleChange} placeholder="Hotel name" required /></div>
        <div><Label htmlFor="chain">Chain</Label><Input id="chain" name="chain" value={formData.chain || ""} onChange={handleChange} placeholder="e.g., Neemrana Hotels" /></div>
        <div><Label htmlFor="location">Location *</Label><Input id="location" name="location" value={formData.location || ""} onChange={handleChange} placeholder="Specific location" required /></div>
        <div><Label htmlFor="city">City *</Label><Input id="city" name="city" value={formData.city || ""} onChange={handleChange} placeholder="City" required /></div>
        <div><Label htmlFor="state">State *</Label><Input id="state" name="state" value={formData.state || ""} onChange={handleChange} placeholder="State" required /></div>
        <div>
          <Label htmlFor="partnershipType">Partnership Type</Label>
          <Select value={formData.partnershipType || "listing"} onValueChange={v => handleSelectChange("partnershipType", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="listing">Listing</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div><Label htmlFor="description">Description *</Label><Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} placeholder="Hotel description" rows={3} required /></div>
      <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} placeholder="hotel@example.com" /></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><Label>Min Price/Night</Label><Input name="price.min" type="number" value={formData.pricePerNight?.min || 0} onChange={handleChange} /></div>
        <div><Label>Max Price/Night</Label><Input name="price.max" type="number" value={formData.pricePerNight?.max || 0} onChange={handleChange} /></div>
        <div><Label>Discount %</Label><Input name="discountPercentage" type="number" min="0" max="100" value={formData.discountPercentage || 0} onChange={handleChange} /></div>
      </div>

      <FileUpload label="Hotel Images" value={formData.images || []} onChange={file => { if (file) setImageFiles([file]); else setImageFiles([]) }} fileType="image" multiple onMultipleChange={files => setImageFiles(files)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Latitude</Label><Input name="coordinates.latitude" type="number" step="0.0001" value={formData.coordinates?.latitude || ""} onChange={handleChange} /></div>
        <div><Label>Longitude</Label><Input name="coordinates.longitude" type="number" step="0.0001" value={formData.coordinates?.longitude || ""} onChange={handleChange} /></div>
      </div>

      <div><Label>Amenities (comma-separated)</Label><Input value={amenitiesInput} onChange={e => setAmenitiesInput(e.target.value)} placeholder="WiFi, Restaurant, Pool, Spa" /></div>

      {/* Nearby Heritage Sites */}
      <div>
        <Label className="mb-2 block">Nearby Heritage Sites</Label>
        {selectedSiteIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSiteIds.map(id => {
              const site = allSites.find(s => s._id === id)
              return site ? (
                <Badge key={id} variant="secondary" className="flex items-center gap-1">
                  {site.name}
                  <button type="button" onClick={() => toggleSite(id)}><X className="h-3 w-3" /></button>
                </Badge>
              ) : null
            })}
          </div>
        )}
        <Input placeholder="Search heritage sites..." value={siteSearch} onChange={e => setSiteSearch(e.target.value)} className="mb-2" />
        <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border">
          {filteredSites.map(site => (
            <label key={site._id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer">
              <Checkbox checked={selectedSiteIds.includes(site._id)} onCheckedChange={() => toggleSite(site._id)} />
              <span className="text-sm">
                <span className="font-medium">{site.name}</span>
                {site.city && <span className="text-muted-foreground ml-1">— {site.city}</span>}
              </span>
            </label>
          ))}
          {filteredSites.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No sites found</p>}
        </div>
      </div>

      {/* Room Types */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Room Types</Label>
          <Button type="button" variant="outline" size="sm" onClick={addRoomType}><Plus className="h-4 w-4 mr-2" />Add Room Type</Button>
        </div>
        <div className="space-y-3">
          {roomTypes.map((room, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Room name" value={room.name} onChange={e => updateRoomType(index, "name", e.target.value)} />
                <Input placeholder="Price per night" type="number" value={room.pricePerNight} onChange={e => updateRoomType(index, "pricePerNight", e.target.value)} />
                <Textarea placeholder="Room description" value={room.description} onChange={e => updateRoomType(index, "description", e.target.value)} rows={2} />
                <Input placeholder="Max occupancy" type="number" value={room.maxOccupancy} onChange={e => updateRoomType(index, "maxOccupancy", e.target.value)} />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={room.isLivingHistory} onCheckedChange={checked => updateRoomType(index, "isLivingHistory", checked)} />
                  <Label className="font-normal text-sm">Living History</Label>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRoomType(index)} className="ml-auto"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Heritage Features */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Heritage Features</h3>
        <div className="space-y-3">
          {[
            { id: "hasLivingHistoryRooms", label: "Has Living History Rooms", key: "hasLivingHistoryRooms" },
            { id: "hasHistoryLectures", label: "Has History Lectures", key: "hasHistoryLectures" },
            { id: "hasCulturalMeals", label: "Has Cultural Meals", key: "hasCulturalMeals" },
            { id: "hasStorytellingEvenings", label: "Has Storytelling Evenings", key: "hasStorytellingEvenings" },
          ].map(({ id, label, key }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox id={id} checked={(formData.heritageFeatures as any)?.[key] || false} onCheckedChange={checked => handleCheckChange(`heritageFeatures.${key}`, checked as boolean)} />
              <Label htmlFor={id} className="font-normal cursor-pointer">{label}</Label>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox id="isActive" checked={formData.isActive ?? true} onCheckedChange={checked => handleCheckChange("isActive", checked as boolean)} />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">Active Hotel</Label>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Hotel</Button>
      </div>
    </form>
  )
}
