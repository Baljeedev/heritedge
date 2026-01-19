'use client'

import type { ReactNode } from 'react'

export interface ThemeProviderProps {
  children: ReactNode
}

// Simple pass-through theme provider for Vite/React; customize as needed
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}
