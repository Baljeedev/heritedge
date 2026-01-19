"use client"

import { ApplicationList } from "@/components/applications/application-list"

export default function ApplicationsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage provider applications for guides, hotels, and experiences
        </p>
      </div>
      <ApplicationList />
    </div>
  )
}
