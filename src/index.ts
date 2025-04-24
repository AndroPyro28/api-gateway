import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { proxy } from 'hono/proxy'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { authMiddleware, TAuthVariables } from './middlewares/auth.middleware'
import { createProxyRoute } from './libs/proxy'

const app = new Hono<{ Variables: TAuthVariables }>().basePath('/api')
.use('*', cors({
    origin: '*', // or '*'
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }))
.use(secureHeaders())
.use(logger())
.use("*", authMiddleware)

// helper to get dynamic path
export type appType = typeof app

// Register proxies
createProxyRoute(app, '/v1/upload', process.env.UPLOAD_SERVICE_URL!)
createProxyRoute(app, '/v1/design', process.env.DESIGN_SERVICE_URL!)
createProxyRoute(app, '/v1/subscription', process.env.SUBSCRIPTION_SERVICE_URL!)

export default app
