import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { proxy } from 'hono/proxy'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import sampleControllers from './routes/user/user.controller'

const app = new Hono().basePath('/api')
.use('/api/*', cors())
.use(secureHeaders())
.use(logger())
.route('/users', sampleControllers)
// helper to get dynamic path
const stripPrefix = (prefix: string, url: string) =>
  url.replace(new RegExp(/^\v1/), '/api')
 
const createProxyRoute = (prefix: string, targetBase: string) => {

  app.all(prefix + '/*', async (c) => {
    const path = stripPrefix(prefix, c.req.url)

    const targetUrl = `${targetBase}/api`
    console.log("URL", targetUrl)
    return proxy(targetUrl, {
      method: c.req.method,
    //   body: await c.req.json(),
      headers: {
        ...c.req.header(),
        'X-Forwarded-For': c.req.header('x-forwarded-for') ?? '127.0.0.1',
        'X-Forwarded-Host': c.req.header('host'),
        Authorization: undefined,
      }
    })
  })
}

// Register proxies
createProxyRoute('/v1/upload', process.env.UPLOAD_SERVICE_URL!)
createProxyRoute('/v1/design', process.env.DESIGN_SERVICE_URL!)
createProxyRoute('/v1/subscription', process.env.SUBSCRIPTION_SERVICE_URL!)

export default app
