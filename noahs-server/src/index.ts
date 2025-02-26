import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Collection, MongoClient } from 'mongodb'
import { cors } from 'hono/cors'
import "dotenv/config"

const app = new Hono()
const mongoUserName = process.env.USR_MONGO 
const mongoUserPWD = process.env.PWD_MONGO 
const mongoUri = `mongodb+srv://${mongoUserName}:${mongoUserPWD}@noahsarktest.znrgw.mongodb.net/`
const client = new MongoClient(mongoUri, { monitorCommands: true });
const dbName = 'sample_mflix'

type queryFunc = (col: Collection) => {}

async function connDB(func: queryFunc) {
  await client.connect()
  console.log('Connected successfully to server');
  const db = client.db(dbName)
  const ction = db.collection('users');

  func(ction)

  return 'done'
}

async function showMsg(collection: Collection): Promise<string>{
  const findRes = await collection.find({}).toArray()
  console.log(findRes);
  return "Real";
}

app.use('/', cors({
  origin: ['http://localhost:4200']
}))
app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Real',
  })
})

app.use('/messages', cors({
  origin: ['http://localhost:4200']
}))
app.get('/messages', (c) => {
  return c.json({
    message: 'Get the message from messages routes'
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  connDB(showMsg)
  console.log(`Server is running on http://localhost:${info.port}`)
})
