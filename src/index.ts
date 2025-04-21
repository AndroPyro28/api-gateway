import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { proxy } from 'hono/proxy'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import sampleControllers from './routes/user/user.controller'
import { authMiddleware, TAuthVariables } from './middlewares/auth.middleware'
import sampleController from './routes/user'

const app = new Hono<{ Variables: TAuthVariables }>().basePath('/api')
.use('/api/*', cors())
.use(secureHeaders())
.use(logger())
.use("*", authMiddleware)
// helper to get dynamic path

const stripPrefix = (prefix: string, url: string) =>
  url.replace(new RegExp(/^\v1/), '/api').split("v1")[1]
 
const createProxyRoute = (prefix: string, targetBase: string) => {

  app.all(prefix + '/*', async (c) => {
    
    const path = stripPrefix(prefix, c.req.url)

    const targetUrl = `${targetBase}/api${path}`
    console.log("PROXY REQUEST URL", targetUrl)
    return await proxy(targetUrl, {
      body: JSON.stringify(await c.req.json()),
      ...c.req,
      headers: {
        ...c.req.header(),
        'X-Forwarded-For': c.req.header('x-forwarded-for') ?? '127.0.0.1',
        'X-Forwarded-Host': c.req.header('host'),
        Authorization: undefined,
        "Content-Type": "application/json"
      }
    })
  })
}

// Register proxies
createProxyRoute('/v1/upload', process.env.UPLOAD_SERVICE_URL!)
createProxyRoute('/v1/design', process.env.DESIGN_SERVICE_URL!)
createProxyRoute('/v1/subscription', process.env.SUBSCRIPTION_SERVICE_URL!)

export default app
