
import { createMiddleware } from "hono/factory";
import { verifyIdToken } from "../libs/google-auth";

export type userAuthPayload = {
  userId: string;
  email: string | undefined;
  name: string | undefined;
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization')

  // Bearer ${token}
  // get the token only

  const token = authHeader && authHeader.split(" ")[1];

  
  if(!token) {
    return c.json({
      error: "Access denied! No Token provided"
    }, 400)
  }

  try {

    const payload = await verifyIdToken(token)

    if(!payload) {
      throw new Error("Access denied! Invalid Token")
    }

    const user = {
      userId: payload['sub'],
      name: payload['name'],
      email: payload['email']
    }

    // * ADD user object in the context
    c.set('user', user)
    c.set("userHeaders", {
      "x-user-id": payload['sub'],
      "x-user-email": payload['email'],
      "x-user-name": payload['name'],
    });

    // * ADD userId in the headers
    c.header('x-user-id', payload['sub'])
    // * ADD email and name in the headers (optional)
    c.header('x-user-email', payload['email'])
    c.header('x-user-name', payload['name'])
    
    await next();

  } catch (error) {
    console.error("AUTH TOKEN VERIFICATION ERROR: ", error)
    return c.json({
      error: "Access denied! Invalid Token"
    }, 401)
  }
});

export type TAuthVariables = {
  user: userAuthPayload;
  userHeaders: {
  'x-user-id': string;
  'x-user-email': string;
  'x-user-name': string;
  }
  
};