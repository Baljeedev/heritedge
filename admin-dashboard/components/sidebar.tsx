"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MapPin, Users, Zap, Building2, Map, Star, LayoutDashboard, Menu, X, Calendar, FileText, Music2, Palette, Globe, ShieldCheck, MessageSquareQuote } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAdminRole } from "@/components/admin-guard"

const managerNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/heritage-sites", label: "Heritage Sites", icon: MapPin },
  { href: "/admin/guides", label: "Guides", icon: Users },
  { href: "/admin/guide-testimonials", label: "Guide Testimonials", icon: MessageSquareQuote },
  { href: "/admin/experiences", label: "Experiences", icon: Zap },
  { href: "/admin/hotels", label: "Hotels", icon: Building2 },
  { href: "/admin/trips", label: "Trips", icon: Map },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/cities", label: "Cities", icon: Globe },
  { href: "/admin/instruments", label: "Instruments", icon: Music2 },
  { href: "/admin/art-forms", label: "Art Forms", icon: Palette },
]

const adminOnlyNavItems = [
  { href: "/admin/managers", label: "Managers", icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { isAdmin } = useAdminRole()

  const navItems = isAdmin ? [...managerNavItems, ...adminOnlyNavItems] : managerNavItems

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border pt-20 md:pt-0 transition-transform md:fixed md:translate-x-0 z-30 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground mb-8">HeritEdge</h1>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant={pathname === href ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
