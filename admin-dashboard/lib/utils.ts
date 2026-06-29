import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSpecializationItems(specialization: string): string[] {
  return specialization
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
