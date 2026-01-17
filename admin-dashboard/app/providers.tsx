"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { ApiProvider } from "@/components/api-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkPublishableKey) {
    throw new Error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable')
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ApiProvider>
        {children}
      </ApiProvider>
    </ClerkProvider>
  )
}