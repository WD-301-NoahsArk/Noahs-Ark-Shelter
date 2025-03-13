import { serve } from '@hono/node-server'
import { app } from './routes'
import "dotenv/config"

serve({
  fetch: app.fetch,
  port: 3000
}, async (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
