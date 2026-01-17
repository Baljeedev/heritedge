// Application Constants
export const APP_NAME = "HeritEdge"
export const APP_DESCRIPTION = "Comprehensive admin dashboard for heritage tourism platform management"
export const APP_VERSION = "1.0.0"

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
export const API_TIMEOUT = 30000 // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZES = [10, 20, 50, 100]

// Validation Rules
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 5000,
  PRICE_MIN: 0,
  PRICE_MAX: 1000000,
  RATING_MIN: 0,
  RATING_MAX: 5,
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  DUPLICATE_ERROR: "This item already exists.",
}

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Item created successfully.",
  UPDATED: "Item updated successfully.",
  DELETED: "Item deleted successfully.",
  SAVED: "Changes saved successfully.",
}

// Date Formats
export const DATE_FORMAT = "yyyy-MM-dd"
export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss"
export const DISPLAY_DATE_FORMAT = "MMM d, yyyy"
