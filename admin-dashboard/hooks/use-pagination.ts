"use client"

import { useState, useCallback } from "react"

interface PaginationState {
  page: number
  limit: number
  total: number
}

export function usePagination(initialLimit = 10) {
  const [state, setState] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    total: 0,
  })

  const goToPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page: Math.max(1, page) }))
  }, [])

  const nextPage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      page: Math.min(prev.page + 1, Math.ceil(prev.total / prev.limit)),
    }))
  }, [])

  const previousPage = useCallback(() => {
    setState((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setState((prev) => ({ ...prev, limit, page: 1 }))
  }, [])

  const setTotal = useCallback((total: number) => {
    setState((prev) => ({ ...prev, total }))
  }, [])

  const reset = useCallback(() => {
    setState({ page: 1, limit: initialLimit, total: 0 })
  }, [initialLimit])

  return {
    ...state,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    setTotal,
    reset,
    hasNextPage: state.page < Math.ceil(state.total / state.limit),
    hasPreviousPage: state.page > 1,
    totalPages: Math.ceil(state.total / state.limit),
  }
}
