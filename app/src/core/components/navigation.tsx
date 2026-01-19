"use client"

import { Globe, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignedIn, UserButton, SignedOut } from '@clerk/clerk-react'
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/language-toggle"


export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl  font-bold">
          <Globe className="w-6 h-6 text-primary" />
          <span>HeritEdge</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/map" className="text-foreground hover:text-primary transition-colors">
            {t('exploreMap')}
          </Link>
          <Link to="/trip-planner" className="text-foreground hover:text-primary transition-colors">
            {t('tripPlanner')}
          </Link>
          <Link to="/experiences" className="text-foreground hover:text-primary transition-colors">
            {t('experiences')}
          </Link>
          <Link to="/donate" className="text-foreground hover:text-primary transition-colors">
            {t('donate')}
          </Link>
          <SignedIn>
            <Link to="/my-bookings" className="text-foreground hover:text-primary transition-colors">
              {t('myBookings')}
            </Link>
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>


        <div className="flex items-center gap-2">
          <LanguageToggle />
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "shadow-lg"
                }
              }}
            />
          </SignedIn>
          
          <SignedOut>
            <Button onClick={() => navigate("/sign-in")}>{t('signIn')}</Button>
          </SignedOut>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link to="/map" className="block text-foreground hover:text-primary py-2">
              {t('exploreMap')}
            </Link>
            <Link to="/trip-planner" className="block text-foreground hover:text-primary py-2">
              {t('tripPlanner')}
            </Link>
            <Link to="/experiences" className="block text-foreground hover:text-primary py-2">
              {t('experiences')}
            </Link>
            <Link to="/donate" className="block text-foreground hover:text-primary py-2">
              {t('donate')}
            </Link>
            <SignedIn>
              <Link to="/my-bookings" className="block text-foreground hover:text-primary py-2">
                {t('myBookings')}
              </Link>
            </SignedIn>
          </div>
        </div>
      )}

    </nav>
  )
}
