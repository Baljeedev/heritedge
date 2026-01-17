// Error Handling Utilities

export interface ErrorResponse {
  code: string
  message: string
  details?: unknown
}

export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 500,
    public details?: unknown,
  ) {
    super(message)
    this.name = "ApplicationError"
  }
}

export function handleError(error: unknown): ErrorResponse {
  console.error("[Error Handler]", error)

  if (error instanceof ApplicationError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    }
  }

  if (error instanceof Error) {
    return {
      code: "INTERNAL_ERROR",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred",
  }
}

export function createErrorResponse(code: string, message: string, statusCode = 500) {
  return {
    success: false,
    error: { code, message },
    statusCode,
  }
}

export function createSuccessResponse<T>(data: T, statusCode = 200) {
  return {
    success: true,
    data,
    statusCode,
  }
}
