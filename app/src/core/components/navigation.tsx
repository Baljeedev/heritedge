"use client"

import { Globe, Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignedIn, UserButton, SignInButton, SignedOut } from '@clerk/clerk-react'
import { Button } from "@/components/ui/button"


export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-serif font-bold">
          <Globe className="w-6 h-6 text-primary" />
          <span>HeritEdge</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/map" className="text-foreground hover:text-primary transition-colors">
            Explore Map
          </Link>
          <Link to="/trip-planner" className="text-foreground hover:text-primary transition-colors">
            Trip Planner
          </Link>
          <Link to="/experiences" className="text-foreground hover:text-primary transition-colors">
            Experiences
          </Link>
          <Link to="/guides" className="text-foreground hover:text-primary transition-colors">
            Guides
          </Link>
          <Link to="/donate" className="text-foreground hover:text-primary transition-colors">
            Donate
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>


        <SignedIn>
          <UserButton />
        </SignedIn>
        
        <SignedOut>
          <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
        </SignedOut>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link to="/map" className="block text-foreground hover:text-primary py-2">
              Explore Map
            </Link>
            <Link to="/trip-planner" className="block text-foreground hover:text-primary py-2">
              Trip Planner
            </Link>
            <Link to="/experiences" className="block text-foreground hover:text-primary py-2">
              Experiences
            </Link>
            <Link to="/guides" className="block text-foreground hover:text-primary py-2">
              Guides
            </Link>
            <Link to="/donate" className="block text-foreground hover:text-primary py-2">
              Donate
            </Link>
          </div>
        </div>
      )}

    </nav>
  )
}
