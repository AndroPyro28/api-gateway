// controllers/index.controller.ts
import { Hono } from 'hono'
import {zValidator} from "@hono/zod-validator"
import { createUser } from '../../schema/user'
import { authMiddleware, TAuthVariables } from '../../middlewares/auth.middleware'
import { sampleService, sampleService2 } from './user.service'
const sampleControllers = new Hono<{Variables: TAuthVariables }>()

.post('/', zValidator('json', createUser), async (c) => {
  const body = c.req.valid('json')
  console.log('hello post')
  const data = await sampleService(body)
  return c.json({data}, 200)
})

.get('/', async (c) => {
  const data = await sampleService2() // array
  return c.json({data}, 200)
})



export default sampleControllers
