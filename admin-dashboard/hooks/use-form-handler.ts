"use client"

import { useState } from "react"
import { toast } from "sonner"

interface FormSubmitOptions<T> {
  onSubmit: (data: T) => Promise<void>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useFormHandler<T>(options: FormSubmitOptions<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: T) => {
    try {
      setLoading(true)
      setError(null)

      await options.onSubmit(data)

      toast.success("Operation successful")
      options.onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
      options.onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return { handleSubmit, loading, error, setError }
}
