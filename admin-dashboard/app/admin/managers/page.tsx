import { ManagerList } from "@/components/managers/manager-list"
import { AdminGuard } from "@/components/admin-guard"
export default function ManagersPage() {
  return (
    <AdminGuard requiredRole="admin">
      <ManagerList />
    </AdminGuard>
  )
}
