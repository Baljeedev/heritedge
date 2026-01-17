// Authentication Utilities

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
  isActive: boolean
}

export interface Session {
  user: User
  token: string
  expiresAt: string
}

// Mock user data - Replace with actual auth in production
const mockUser: User = {
  id: "1",
  email: "admin@heri-edge.com",
  name: "Admin User",
  role: "admin",
  isActive: true,
}

export function getCurrentUser(): User | null {
  // In production, verify JWT token and fetch user from database
  // For development, return mock user
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    return token ? mockUser : null
  }
  return null
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export function hasRole(role: "admin" | "moderator" | "user"): boolean {
  const user = getCurrentUser()
  return user?.role === role || false
}

export function hasPermission(permission: string): boolean {
  const user = getCurrentUser()
  if (!user) return false

  const adminPermissions = ["view:all", "create:all", "edit:all", "delete:all"]

  const moderatorPermissions = ["view:all", "edit:content", "moderate:reviews"]

  const userPermissions = ["view:own", "edit:own"]

  const rolePermissions: Record<string, string[]> = {
    admin: adminPermissions,
    moderator: moderatorPermissions,
    user: userPermissions,
  }

  return (rolePermissions[user.role] || []).includes(permission)
}
