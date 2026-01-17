// Logging Utility

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
  stack?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"

  private formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      stack: error?.stack,
    }

    const formatted = this.formatLog(entry)

    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted, data)
          break
        case LogLevel.INFO:
          console.info(formatted, data)
          break
        case LogLevel.WARN:
          console.warn(formatted, data)
          break
        case LogLevel.ERROR:
          console.error(formatted, data, error?.stack)
          break
      }
    }

    // In production, send to external logging service
    // Example: sendToSentry(entry)
  }

  debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, error?: Error, data?: unknown) {
    this.log(LogLevel.ERROR, message, data, error)
  }
}

export const logger = new Logger()
