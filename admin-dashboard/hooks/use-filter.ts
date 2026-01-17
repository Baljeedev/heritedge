"use client"

import { useState, useCallback } from "react"

interface FilterState {
  [key: string]: string | string[] | boolean | undefined
}

export function useFilter(initialFilters: FilterState = {}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const setFilter = useCallback((key: string, value: string | string[] | boolean | undefined) => {
    setFilters((prev) => {
      if (value === undefined || value === "") {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: value }
    })
  }, [])

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const { [key]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const getFilterValue = useCallback(
    (key: string) => {
      return filters[key]
    },
    [filters],
  )

  const hasFilters = Object.keys(filters).length > 0

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    getFilterValue,
    hasFilters,
  }
}
