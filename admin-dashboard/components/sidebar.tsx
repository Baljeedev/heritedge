"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MapPin, Users, Zap, Building2, Map, Star, LayoutDashboard, Menu, X, Calendar, FileText } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/heritage-sites", label: "Heritage Sites", icon: MapPin },
  { href: "/admin/guides", label: "Guides", icon: Users },
  { href: "/admin/experiences", label: "Experiences", icon: Zap },
  { href: "/admin/hotels", label: "Hotels", icon: Building2 },
  { href: "/admin/trips", label: "Trips", icon: Map },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/applications", label: "Applications", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border pt-20 md:pt-0 transition-transform md:fixed md:translate-x-0 z-30",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground mb-8">HeritEdge</h1>
          <nav className="space-y-2">
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

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
