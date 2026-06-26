"use client"

import axios from "axios"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001"

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Token getter function - will be set by the auth hook
let getTokenFn: (() => Promise<string | null>) | null = null

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  getTokenFn = fn
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      const token = await getTokenFn()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
// Do not redirect to /sign-in on API 401 — Clerk session may still be valid while a
// backend call fails (e.g. local API, expired token). AdminGuard handles auth routing.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default apiClient
