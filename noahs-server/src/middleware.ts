import { cors } from 'hono/cors'
import "dotenv/config"
import type { Context, Next } from 'hono'

export const corsTest = cors({
  origin: ['http://localhost:4200']
})

export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { message: 'Unauthorized: Missing or invalid Authorization header' }, 
      401
    )
  }

  const token = authHeader.split(' ')[1]
  const validToken = process.env.API_TOKEN || 'test-token'
  
  if (token !== validToken) {
    return c.json(
      { message: 'Unauthorized: Invalid token' }, 
      401
    )
  }
  
  c.set('visitor', { authenticated: true })
  await next()
}
