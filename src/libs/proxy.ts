import { proxy } from "hono/proxy"
import { appType } from ".."
import { authMiddleware } from "../middlewares/auth.middleware"

const stripPrefix = (prefix: string, url: string) =>
  url.replace(new RegExp(/^\v1/), '/api').split("v1")[1]

export const createProxyRoute = (app: appType, prefix: string, targetBase: string) => {
    app.all(prefix + '/*' ,async (c) => {
      const path = stripPrefix(prefix, c.req.url)
      const targetUrl = `${targetBase}/api${path}`
      console.log('PROXY REQUEST URL', targetUrl)
      
      const method = c.req.method

      
      
      let body: unknown = undefined
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          body = await c.req.json()
        } catch (e) {
          console.warn('No JSON body to parse or invalid JSON:', e)
        }
      }
  
      const response = await proxy(targetUrl, {
        method,
        headers: {
          ...c.get('userHeaders'),
          ...c.req.header(),
          'X-Forwarded-For': c.req.header('x-forwarded-for') ?? '127.0.0.1',
          'X-Forwarded-Host': c.req.header('host'),
          Authorization: undefined,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      })

      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')


      return response

    })
  }

 