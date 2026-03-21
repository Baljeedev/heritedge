"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { instrumentsApi, type IInstrument } from "@/lib/api/instruments"
import { InstrumentForm } from "./instrument-form"

export function InstrumentList() {
  const [instruments, setInstruments] = useState<IInstrument[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<IInstrument | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await instrumentsApi.getAll()
      setInstruments(data.instruments)
    } catch { toast.error("Failed to load instruments") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() =>
    instruments.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
    ), [instruments, search])

  const handleSave = async (data: Partial<IInstrument>) => {
    try {
      if (editing) { await instrumentsApi.update(editing._id, data); toast.success("Instrument updated") }
      else { await instrumentsApi.create(data); toast.success("Instrument created") }
      setShowForm(false); setEditing(null); load()
    } catch (e: any) { toast.error(e.message || "Failed to save") }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try { await instrumentsApi.delete(deletingId); toast.success("Instrument deleted"); setDeletingId(null); load() }
    catch { toast.error("Failed to delete") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instruments</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} instruments</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Instrument
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name or category..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(instrument => (
            <div key={instrument._id} className="bg-card border border-border rounded-lg p-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{instrument.name}</p>
                <p className="text-sm text-muted-foreground">{instrument.category}</p>
                {instrument.origin && <p className="text-xs text-muted-foreground">{instrument.origin}</p>}
                <Badge variant={instrument.isActive ? "default" : "secondary"} className="mt-1 text-xs">
                  {instrument.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(instrument); setShowForm(true) }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletingId(instrument._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">No instruments found</div>}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={open => { setShowForm(open); if (!open) setEditing(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Instrument" : "Add Instrument"}</DialogTitle></DialogHeader>
          <InstrumentForm instrument={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Instrument</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
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
