"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { ICity } from "@/lib/api/cities"

interface CityFormProps {
  city?: ICity | null
  onSave: (data: Partial<ICity>) => void
  onCancel: () => void
}

export function CityForm({ city, onSave, onCancel }: CityFormProps) {
  const [name, setName] = useState(city?.name || "")
  const [state, setState] = useState(city?.state || "")
  const [country, setCountry] = useState(city?.country || "India")
  const [isActive, setIsActive] = useState(city?.isActive ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, state, country, isActive })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">City Name *</Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Jaipur" required />
      </div>
      <div>
        <Label htmlFor="state">State *</Label>
        <Input id="state" value={state} onChange={e => setState(e.target.value)} placeholder="e.g., Rajasthan" required />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" value={country} onChange={e => setCountry(e.target.value)} placeholder="India" />
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
