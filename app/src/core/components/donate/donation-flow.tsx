"use client"

import { useState } from "react"
import { ChevronLeft, Heart, Gift, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DonationFlowProps {
  projectId: number
  onClose: () => void
}

const DONATION_AMOUNTS = [25, 50, 100, 250, 500, 1000]

export function DonationFlow({ onClose }: DonationFlowProps) {
  const [step, setStep] = useState(0)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [makePublic, setMakePublic] = useState(false)

  const project = {
    id: 1,
    name: "Taj Mahal Marble Restoration",
    location: "Agra, India",
    fundingGoal: 500000,
    fundingRaised: 287500,
  }

  const donationAmount = customAmount ? Number.parseInt(customAmount) : selectedAmount

  const steps = [
    { label: "Amount", icon: Gift },
    { label: "Type", icon: Heart },
    { label: "Details", icon: Users },
    { label: "Confirm", icon: null },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl  font-bold text-foreground">Support Restoration</h1>
        <div className="w-10" />
      </div>

      {/* Steps */}
      <div className="flex gap-2 mb-8">
        {steps.map((s, index) => {
          const Icon = s.icon
          return (
            <div key={index} className="flex-1">
              <div
                className={`p-3 rounded-lg text-center transition-all ${index <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
              >
                {Icon && <Icon className="w-5 h-5 mx-auto mb-1" />}
                <p className="text-xs font-semibold">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-lg p-8 mb-8 min-h-96">
        {step === 0 && (
          <div>
            <h2 className="text-2xl  font-bold text-foreground mb-6">How much would you like to donate?</h2>
            <p className="text-muted-foreground mb-6">Your donation directly supports the {project.name} project</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {DONATION_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount("")
                  }}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${selectedAmount === amount && !customAmount
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 text-foreground"
                    }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">Custom Amount</label>
              <div className="flex items-center">
                <span className="text-foreground mr-2">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(0)
                  }}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-primary mb-1">Your Donation</p>
              <p className="text-3xl font-bold text-foreground">${donationAmount}</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-2xl  font-bold text-foreground mb-6">Donation Type</h2>
            <p className="text-muted-foreground mb-6">Choose how you'd like to contribute</p>

            <div className="space-y-4">
              {[
                { type: "one-time", title: "One-Time Donation", desc: "Make a single contribution now" },
                { type: "monthly", title: "Monthly Support", desc: "Commit to recurring monthly donations" },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setDonationType(option.type as "one-time" | "monthly")}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${donationType === option.type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                    }`}
                >
                  <p className="font-semibold text-foreground">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>

            {donationType === "monthly" && (
              <div className="mt-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  You'll donate <strong>${donationAmount}</strong> every month. Cancel anytime.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl  font-bold text-foreground mb-6">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={makePublic}
                  onChange={(e) => setMakePublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-foreground">Make my donation public and add me to donors list</span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl  font-bold text-foreground mb-6">Confirm Your Donation</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Project</span>
                <span className="font-semibold text-foreground">{project.name}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Donation Amount</span>
                <span className="font-semibold text-foreground">${donationAmount}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Type</span>
                <span className="font-semibold text-foreground capitalize">{donationType.replace("-", " ")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Donor Name</span>
                <span className="font-semibold text-foreground">{makePublic ? name : "Anonymous"}</span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                By donating, you agree to our terms and will receive periodic updates on project progress.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex-1"
        >
          Previous
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              alert(
                `Thank you for your ${donationAmount === 1 ? "donation" : "commitment"}! 🎉\n\nA confirmation will be sent to ${email}`,
              )
              onClose()
            }}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Complete Donation
          </Button>
        )}
      </div>
    </div>
  )
}
