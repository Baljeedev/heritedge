"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { citiesApi, type ICity } from "@/lib/api/cities"
import { CityForm } from "./city-form"

export function CityList() {
  const [cities, setCities] = useState<ICity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingCity, setEditingCity] = useState<ICity | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await citiesApi.getAll()
      setCities(data.cities)
    } catch (e: any) {
      toast.error("Failed to load cities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() =>
    cities.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
    ), [cities, search])

  const handleSave = async (data: Partial<ICity>) => {
    try {
      if (editingCity) {
        await citiesApi.update(editingCity._id, data)
        toast.success("City updated")
      } else {
        await citiesApi.create(data)
        toast.success("City created")
      }
      setShowForm(false)
      setEditingCity(null)
      load()
    } catch (e: any) {
      toast.error(e.message || "Failed to save city")
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await citiesApi.delete(deletingId)
      toast.success("City deleted")
      setDeletingId(null)
      load()
    } catch (e: any) {
      toast.error("Failed to delete city")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cities</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} cities</p>
        </div>
        <Button onClick={() => { setEditingCity(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add City
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name or state..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(city => (
            <div key={city._id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{city.name}</p>
                <p className="text-sm text-muted-foreground">{city.state}</p>
                <Badge variant={city.isActive ? "default" : "secondary"} className="mt-1 text-xs">
                  {city.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditingCity(city); setShowForm(true) }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletingId(city._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">No cities found</div>
          )}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={open => { setShowForm(open); if (!open) setEditingCity(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCity ? "Edit City" : "Add City"}</DialogTitle>
          </DialogHeader>
          <CityForm city={editingCity} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingCity(null) }} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete City</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this city? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
