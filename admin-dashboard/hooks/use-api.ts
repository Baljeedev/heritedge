"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import apiClient from "@/lib/api-client"

interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
  showNotification?: boolean
}

export function useApi<T>(options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", url: string, payload?: unknown) => {
      try {
        setLoading(true)
        setError(null)

        const config = {
          method,
          url,
          data: payload,
        }

        const response = await apiClient(config)
        setData(response.data as T)

        if (options.onSuccess) {
          options.onSuccess(response.data)
        }

        if (options.showNotification) {
          toast.success("Operation successful")
        }

        return response.data
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error")
        setError(error)

        if (options.onError) {
          options.onError(error)
        }

        if (options.showNotification) {
          toast.error(error.message || "An error occurred")
        }

        throw error
      } finally {
        setLoading(false)
      }
    },
    [options],
  )

  const get = useCallback((url: string) => execute("GET", url), [execute])
  const post = useCallback((url: string, payload: unknown) => execute("POST", url, payload), [execute])
  const put = useCallback((url: string, payload: unknown) => execute("PUT", url, payload), [execute])
  const patch = useCallback((url: string, payload: unknown) => execute("PATCH", url, payload), [execute])
  const remove = useCallback((url: string) => execute("DELETE", url), [execute])

  return { data, loading, error, get, post, put, patch, delete: remove }
}
