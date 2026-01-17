"use client"

import { UserButton } from "@clerk/nextjs"

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center justify-end px-6 py-4">
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  )
}
