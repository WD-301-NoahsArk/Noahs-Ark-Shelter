import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/', cors({
  origin: ['http://localhost:4200/']
}))
app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Real',
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
