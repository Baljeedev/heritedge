// Local Storage Utilities (Client-side only)

const isClient = typeof window !== "undefined"

export const storage = {
  getItem: (key: string): string | null => {
    if (!isClient) return null
    try {
      return window.localStorage.getItem(key)
    } catch (error) {
      console.error(`[Storage Error] Failed to get item: ${key}`, error)
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isClient) return
    try {
      window.localStorage.setItem(key, value)
    } catch (error) {
      console.error(`[Storage Error] Failed to set item: ${key}`, error)
    }
  },

  removeItem: (key: string): void => {
    if (!isClient) return
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`[Storage Error] Failed to remove item: ${key}`, error)
    }
  },

  clear: (): void => {
    if (!isClient) return
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error("[Storage Error] Failed to clear storage", error)
    }
  },

  getJSON: <T>(key: string, defaultValue: T): T => {\
    const item = storage.getItem(key)
    if (!item) return defaultValue
    try {\
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`[Storage Error] Failed to parse JSON: ${key}`, error)\
      return defaultValue
    }
  },

  setJSON: <T>(key: string, value: T): void => {\
    try {
      storage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[Storage Error] Failed to stringify JSON: ${key}`, error)
    }
  },
}\
