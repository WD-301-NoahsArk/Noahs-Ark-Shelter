import { Hono } from 'hono'
import { connDB } from './db'
import { showMsg } from './api'
import { corsTest, authenticate } from './middleware'

export const app = new Hono()

app.use('*', corsTest)
app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Real',
  })
})

app.use('/users', authenticate)

app.get('/users', async (c) => {
  try {
    const msgs = await connDB(showMsg)
    console.log(msgs);
    return c.json(msgs)
  } catch (error) {
    console.error("Error fetching messages", error)
    return c.json({ message: "Error fetching messages" }, 500)
  }
})
