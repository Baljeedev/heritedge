"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Users, Zap, Building2, Map, Star, Clock, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { heritageSitesApi, guidesApi, experiencesApi, hotelsApi, tripsApi, reviewsApi } from "@/lib/api"

interface Stat {
  label: string
  value: string | number
  icon: any
  color: string
  href: string
  loading?: boolean
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Total Heritage Sites",
      value: 0,
      icon: MapPin,
      color: "bg-amber-100 text-amber-700",
      href: "/admin/heritage-sites",
      loading: true,
    },
    {
      label: "Total Guides",
      value: 0,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
      href: "/admin/guides",
      loading: true,
    },
    {
      label: "Total Experiences",
      value: 0,
      icon: Zap,
      color: "bg-purple-100 text-purple-700",
      href: "/admin/experiences",
      loading: true,
    },
    {
      label: "Total Hotels",
      value: 0,
      icon: Building2,
      color: "bg-green-100 text-green-700",
      href: "/admin/hotels",
      loading: true,
    },
    {
      label: "Total Trips",
      value: 0,
      icon: Map,
      color: "bg-red-100 text-red-700",
      href: "/admin/trips",
      loading: true,
    },
    {
      label: "Total Reviews",
      value: 0,
      icon: Star,
      color: "bg-yellow-100 text-yellow-700",
      href: "/admin/reviews",
      loading: true,
    },
    {
      label: "Pending Applications",
      value: 0,
      icon: Clock,
      color: "bg-orange-100 text-orange-700",
      href: "/admin/guides",
      loading: true,
    },
  ])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [sitesRes, guidesRes, experiencesRes, hotelsRes, tripsRes, reviewsRes] = await Promise.all([
        heritageSitesApi.getAll({ limit: 1 }),
        guidesApi.getAll({ limit: 1, all: true }),
        experiencesApi.getAll({ limit: 1, all: true }),
        hotelsApi.getAll({ limit: 1, all: true }),
        tripsApi.getAll({ limit: 1 }),
        reviewsApi.getAll({ limit: 1, all: true }),
      ])

      // Count pending internship applications
      const allGuides = await guidesApi.getAll({ limit: 1000, all: true })
      const pendingInterns = allGuides.guides.filter(
        (g) => g.isIntern && g.internshipStatus === "pending"
      ).length

      setStats([
        {
          label: "Total Heritage Sites",
          value: sitesRes.total,
          icon: MapPin,
          color: "bg-amber-100 text-amber-700",
          href: "/admin/heritage-sites",
          loading: false,
        },
        {
          label: "Total Guides",
          value: guidesRes.total,
          icon: Users,
          color: "bg-blue-100 text-blue-700",
          href: "/admin/guides",
          loading: false,
        },
        {
          label: "Total Experiences",
          value: experiencesRes.total,
          icon: Zap,
          color: "bg-purple-100 text-purple-700",
          href: "/admin/experiences",
          loading: false,
        },
        {
          label: "Total Hotels",
          value: hotelsRes.total,
          icon: Building2,
          color: "bg-green-100 text-green-700",
          href: "/admin/hotels",
          loading: false,
        },
        {
          label: "Total Trips",
          value: tripsRes.total,
          icon: Map,
          color: "bg-red-100 text-red-700",
          href: "/admin/trips",
          loading: false,
        },
        {
          label: "Total Reviews",
          value: reviewsRes.total,
          icon: Star,
          color: "bg-yellow-100 text-yellow-700",
          href: "/admin/reviews",
          loading: false,
        },
        {
          label: "Pending Applications",
          value: pendingInterns,
          icon: Clock,
          color: "bg-orange-100 text-orange-700",
          href: "/admin/guides",
          loading: false,
        },
      ])
    } catch (error: any) {
      console.error("Failed to load dashboard stats:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the HeritEdge Admin Dashboard</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, href, loading }) => (
          <Link key={label} href={href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  {loading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary mt-2" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>View all</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Site Health</h3>
          <p className="text-3xl font-bold text-blue-900">94%</p>
          <p className="text-sm text-blue-700 mt-2">Heritage sites in good condition</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Avg Guide Rating</h3>
          <p className="text-3xl font-bold text-green-900">4.6★</p>
          <p className="text-sm text-green-700 mt-2">Based on 5,432 reviews</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Booking Rate</h3>
          <p className="text-3xl font-bold text-purple-900">78%</p>
          <p className="text-sm text-purple-700 mt-2">Conversion for featured trips</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
            <div>
              <p className="font-medium text-foreground">New Heritage Site Added</p>
              <p className="text-sm text-muted-foreground">Taj Mahal Complex</p>
            </div>
            <p className="text-sm text-muted-foreground">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
            <div>
              <p className="font-medium text-foreground">Guide Application Approved</p>
              <p className="text-sm text-muted-foreground">Rajesh Kumar - Intern Program</p>
            </div>
            <p className="text-sm text-muted-foreground">4 hours ago</p>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
            <div>
              <p className="font-medium text-foreground">New Hotel Listed</p>
              <p className="text-sm text-muted-foreground">Neemrana Fort Palace</p>
            </div>
            <p className="text-sm text-muted-foreground">1 day ago</p>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
            <div>
              <p className="font-medium text-foreground">Music Experience Published</p>
              <p className="text-sm text-muted-foreground">Classical Hindustani Music Show</p>
            </div>
            <p className="text-sm text-muted-foreground">2 days ago</p>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">New 5-Star Review</p>
              <p className="text-sm text-muted-foreground">Taj Mahal tour - "Incredible experience!"</p>
            </div>
            <p className="text-sm text-muted-foreground">3 days ago</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
