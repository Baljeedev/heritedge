"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { SignedIn, UserButton, SignedOut } from '@clerk/clerk-react'
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { LanguageToggle } from "@/components/language-toggle"
import { Logo } from "@/core/components/logo"
import type { TranslationKey } from "@/lib/i18n/translations"
import { cn } from "@/lib/utils"

const PUBLIC_NAV_LINKS: { to: string; labelKey: TranslationKey }[] = [
  { to: "/experiences", labelKey: "experiences" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useI18n()

  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    cn(
      "relative text-sm font-medium tracking-wide transition-colors py-1",
      isActive(path)
        ? "text-primary"
        : "text-foreground/80 hover:text-primary"
    )

  const mobileNavLinkClass = (path: string) =>
    cn(
      "block py-2.5 text-sm font-medium transition-colors",
      isActive(path) ? "text-primary" : "text-foreground hover:text-primary"
    )

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-[0_1px_0_oklch(0.42_0.15_35/0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Logo size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {PUBLIC_NAV_LINKS.map(({ to, labelKey }) => (
            <Link key={to} to={to} className={navLinkClass(to)}>
              {t(labelKey)}
              {isActive(to) && (
                <span className="absolute -bottom-3 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          <SignedIn>
            <Link to="/my-bookings" className={navLinkClass("/my-bookings")}>
              {t("myBookings")}
            </Link>
          </SignedIn>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonPopoverCard: "shadow-lg",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Button
              onClick={() => navigate("/sign-in")}
              className="hidden sm:inline-flex rounded-full px-5 font-medium"
            >
              {t("signIn")}
            </Button>
          </SignedOut>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-1">
            {PUBLIC_NAV_LINKS.map(({ to, labelKey }) => (
              <Link
                key={to}
                to={to}
                className={mobileNavLinkClass(to)}
                onClick={() => setIsOpen(false)}
              >
                {t(labelKey)}
              </Link>
            ))}
            <SignedIn>
              <Link
                to="/my-bookings"
                className={mobileNavLinkClass("/my-bookings")}
                onClick={() => setIsOpen(false)}
              >
                {t("myBookings")}
              </Link>
            </SignedIn>
            <SignedOut>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  navigate("/sign-in")
                }}
                className="w-full mt-2 rounded-full"
              >
                {t("signIn")}
              </Button>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  )
}
