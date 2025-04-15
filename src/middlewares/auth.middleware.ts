
import { createMiddleware } from "hono/factory";
export const authMiddleware = createMiddleware(async (c, next) => {
  const user = c.get("authUser");
 
  await next();
});

export type TAuthVariables = {
  sample:string
};