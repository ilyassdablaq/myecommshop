import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const isProduction = process.env.NODE_ENV === 'production'
const redisUrl = isProduction ? process.env.REDIS_URL : undefined

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: redisUrl,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    workerMode: (process.env.WORKER_MODE as "shared" | "worker" | "server") || "shared",
  },
  modules: {
    ...(redisUrl
      ? {
          eventBus: {
            resolve: "@medusajs/event-bus-redis",
            options: {
              redisUrl,
            },
          },
          cacheService: {
            resolve: "@medusajs/cache-redis",
            options: {
              redisUrl,
            },
          },
        }
      : {}),
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
})
