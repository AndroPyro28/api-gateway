import { z } from 'zod'
export const user = z.object({ id: z.string(), name: z.string() })
export type TUser = z.infer<typeof user>

export const createUser = user.pick({
    name:true
})

export type TCreateUser = z.infer<typeof createUser>