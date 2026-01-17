// Environment Variables Validation

const requiredEnvVars = ["NEXT_PUBLIC_API_URL"]

const optionalEnvVars = ["API_SECRET_KEY", "DATABASE_URL", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"]

export function validateEnv() {
  const missingVars: string[] = []

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
  })

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  apiSecret: process.env.API_SECRET_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
  nodeEnv: (process.env.NODE_ENV || "development") as "development" | "production" | "test",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
}
