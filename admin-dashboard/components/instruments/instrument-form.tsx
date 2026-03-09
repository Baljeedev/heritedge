"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { IInstrument } from "@/lib/api/instruments"

const CATEGORIES = ["String", "Wind", "Percussion", "Keyboard", "Vocal", "Electronic", "Folk", "Other"]

interface InstrumentFormProps {
  instrument?: IInstrument | null
  onSave: (data: Partial<IInstrument>) => void
  onCancel: () => void
}

export function InstrumentForm({ instrument, onSave, onCancel }: InstrumentFormProps) {
  const [name, setName] = useState(instrument?.name || "")
  const [category, setCategory] = useState(instrument?.category || "")
  const [origin, setOrigin] = useState(instrument?.origin || "")
  const [description, setDescription] = useState(instrument?.description || "")
  const [isActive, setIsActive] = useState(instrument?.isActive ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, category, origin: origin || undefined, description: description || undefined, isActive })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name *</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Sitar" required />
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
