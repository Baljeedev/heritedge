"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { artFormsApi, type IArtForm } from "@/lib/api/art-forms"
import { ArtFormForm } from "./art-form-form"

export function ArtFormList() {
  const [artForms, setArtForms] = useState<IArtForm[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<IArtForm | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try { const data = await artFormsApi.getAll(); setArtForms(data.artForms) }
    catch { toast.error("Failed to load art forms") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() =>
    artForms.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())),
    [artForms, search])

  const handleSave = async (data: Partial<IArtForm>) => {
    try {
      if (editing) { await artFormsApi.update(editing._id, data); toast.success("Art form updated") }
      else { await artFormsApi.create(data); toast.success("Art form created") }
      setShowForm(false); setEditing(null); load()
    } catch (e: any) { toast.error(e.message || "Failed to save") }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try { await artFormsApi.delete(deletingId); toast.success("Art form deleted"); setDeletingId(null); load() }
    catch { toast.error("Failed to delete") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Art Forms</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} art forms</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Art Form
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
          {filtered.map(af => (
            <div key={af._id} className="bg-card border border-border rounded-lg p-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{af.name}</p>
                <p className="text-sm text-muted-foreground">{af.category}</p>
                {af.origin && <p className="text-xs text-muted-foreground">{af.origin}</p>}
                <Badge variant={af.isActive ? "default" : "secondary"} className="mt-1 text-xs">{af.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => { setEditing(af); setShowForm(true) }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletingId(af._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">No art forms found</div>}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={open => { setShowForm(open); if (!open) setEditing(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Art Form" : "Add Art Form"}</DialogTitle></DialogHeader>
          <ArtFormForm artForm={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Art Form</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
