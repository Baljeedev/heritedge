"use client"

import { DonationFlow } from "@/core/components/donate/donation-flow"
import { DonationHero } from "@/core/components/donate/donation-hero"
import { RestorationProjects } from "@/core/components/donate/restoration-projects"
import { Navigation } from "@/core/components/navigation"
import { useState } from "react"

export default function DonatePage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [showDonationFlow, setShowDonationFlow] = useState(false)

  const handleStartDonation = (projectId: number) => {
    setSelectedProject(projectId)
    setShowDonationFlow(true)
  }

  const handleCloseDonation = () => {
    setShowDonationFlow(false)
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {!showDonationFlow ? (
        <>
          <DonationHero />
          <RestorationProjects onSelectProject={handleStartDonation} />

          {/* Impact Section */}
          <section className="py-16 px-4 bg-card">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4 text-center">Your Impact</h2>
              <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
                Every donation directly supports heritage preservation, creates jobs for local communities, and ensures
                these treasures survive for future generations.
              </p>

              <div className="grid md:grid-cols-4 gap-6">
                <ImpactCard value="$2.4M+" label="Total Donations" />
                <ImpactCard value="1,250+" label="Active Projects" />
                <ImpactCard value="5,000+" label="Local Jobs Created" />
                <ImpactCard value="15+" label="Sites Restored" />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
                How Your Donation Works
              </h2>

              <div className="grid md:grid-cols-4 gap-8">
                <ProcessStep
                  number={1}
                  title="Choose a Project"
                  description="Select from active heritage restoration projects worldwide"
                />
                <ProcessStep
                  number={2}
                  title="Make Your Donation"
                  description="Secure payment processing with transparent tracking"
                />
                <ProcessStep
                  number={3}
                  title="Track Progress"
                  description="Receive real-time updates on restoration work and impact"
                />
                <ProcessStep
                  number={4}
                  title="Join the Community"
                  description="Connect with other donors and heritage enthusiasts"
                />
              </div>
            </div>
          </section>

          {/* Transparency Section */}
          <section className="py-16 px-4 bg-primary text-primary-foreground">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-serif font-bold mb-6">Complete Transparency</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                We believe in full accountability. View detailed breakdowns of how funds are allocated, see monthly
                progress reports, and understand the direct impact of your contribution.
              </p>
              <button className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
                View Financial Reports
              </button>
            </div>
          </section>
        </>
      ) : (
        <div className="py-8 px-4">
          <DonationFlow projectId={selectedProject || 1} onClose={handleCloseDonation} />
        </div>
      )}
    </div>
  )
}

function ImpactCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-background border border-border rounded-lg p-6 text-center">
      <p className="text-3xl font-bold text-primary mb-2">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  )
}

function ProcessStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-serif font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
