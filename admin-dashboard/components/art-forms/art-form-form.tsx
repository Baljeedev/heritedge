"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { IArtForm } from "@/lib/api/art-forms"

const CATEGORIES = ["Visual", "Performing", "Textile", "Craft", "Culinary", "Literary", "Folk", "Other"]

interface ArtFormFormProps {
  artForm?: IArtForm | null
  onSave: (data: Partial<IArtForm>) => void
  onCancel: () => void
}

export function ArtFormForm({ artForm, onSave, onCancel }: ArtFormFormProps) {
  const [name, setName] = useState(artForm?.name || "")
  const [category, setCategory] = useState(artForm?.category || "")
  const [origin, setOrigin] = useState(artForm?.origin || "")
  const [description, setDescription] = useState(artForm?.description || "")
  const [isActive, setIsActive] = useState(artForm?.isActive ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, category, origin: origin || undefined, description: description || undefined, isActive })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name *</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Kathak" required />
      </div>
      <div>
        <Label>Category *</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>Origin</Label>
        <Input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g., North India" />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="isActive" checked={isActive} onCheckedChange={v => setIsActive(v as boolean)} />
        <Label htmlFor="isActive" className="font-normal cursor-pointer">Active</Label>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}
