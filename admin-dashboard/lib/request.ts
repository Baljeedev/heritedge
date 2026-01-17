// HTTP Request Utilities

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  retries?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  statusCode: number
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function request<T = unknown>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, timeout = 30000, retries = 3 } = config

  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new ApiError(response.status, "HTTP_ERROR", `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data as T,
        statusCode: response.status,
      }
    } catch (error) {
      lastError = error as Error
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  const error = lastError || new Error("Unknown error")
  console.error(`[Request Error] ${url}:`, error.message)

  return {
    success: false,
    error: {
      code: error instanceof ApiError ? error.code : "REQUEST_ERROR",
      message: error.message,
    },
    statusCode: error instanceof ApiError ? error.statusCode : 500,
  }
}
