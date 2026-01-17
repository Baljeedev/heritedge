"use client"

import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

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
    // Get token from Clerk if available
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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to sign-in
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in"
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
