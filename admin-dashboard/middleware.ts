// Frontend-only authentication - no server-side protection needed
// All authentication is handled client-side via AdminGuard component
// This means CLERK_SECRET_KEY is NOT required for the frontend

// Empty middleware - all protection happens client-side in AdminGuard
// This file exists to prevent Next.js from looking for Clerk server-side features

export function middleware() {
  // No-op - all authentication handled client-side
}

export const config = {
  matcher: [
    // Don't match anything - no server-side processing needed
    '/((?!.*).*)',
  ],
}