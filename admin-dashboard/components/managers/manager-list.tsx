"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Loader2, ShieldCheck, UserCheck } from "lucide-react"
import { toast } from "sonner"
import { adminUsersApi, type IAdminUser } from "@/lib/api/admin-users"
import { useUser } from "@clerk/nextjs"

export function ManagerList() {
  const { user } = useUser()
  const [users, setUsers] = useState<IAdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // New manager form state
  const [newEmail, setNewEmail] = useState("")
  const [newName, setNewName] = useState("")
  const [newClerkId, setNewClerkId] = useState("")
  const [newRole, setNewRole] = useState<"admin" | "manager">("manager")

  const load = async () => {
    setLoading(true)
    try { const data = await adminUsersApi.getAll(); setUsers(data.users) }
    catch { toast.error("Failed to load managers") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await adminUsersApi.create({
        clerkUserId: newClerkId,
        email: newEmail,
        name: newName,
        role: newRole,
        addedBy: user?.id,
      })
      toast.success("Manager added successfully")
      setShowForm(false)
      setNewEmail(""); setNewName(""); setNewClerkId(""); setNewRole("manager")
      load()
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to add manager")
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try { await adminUsersApi.delete(deletingId); toast.success("Manager removed"); setDeletingId(null); load() }
    catch { toast.error("Failed to remove manager") }
  }

  const handleToggleActive = async (u: IAdminUser) => {
    try {
      await adminUsersApi.update(u._id, { isActive: !u.isActive })
      toast.success(u.isActive ? "Manager deactivated" : "Manager activated")
      load()
    } catch { toast.error("Failed to update") }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Managers</h1>
          <p className="text-muted-foreground mt-1">Manage admin and manager access</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Manager
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Note:</strong> To add a manager, you need their Clerk User ID. They must first sign in to the admin dashboard to generate a Clerk account. You can find their Clerk User ID in the Clerk dashboard.
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u._id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {u.role === "admin" ? <ShieldCheck className="h-5 w-5 text-primary" /> : <UserCheck className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <p className="text-xs text-muted-foreground font-mono">{u.clerkUserId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                <Badge variant={u.isActive ? "default" : "outline"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(u)}>
                  {u.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeletingId(u._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No managers added yet</div>
          )}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Manager</DialogTitle></DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" required />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="manager@example.com" required />
            </div>
            <div>
              <Label>Clerk User ID *</Label>
              <Input value={newClerkId} onChange={e => setNewClerkId(e.target.value)} placeholder="user_..." required />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={v => setNewRole(v as "admin" | "manager")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Add Manager</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Manager</AlertDialogTitle>
            <AlertDialogDescription>This will revoke their access to the dashboard.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
