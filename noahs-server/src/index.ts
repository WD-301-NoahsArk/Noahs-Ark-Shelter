import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Collection, MongoClient, type WithId, type Document } from 'mongodb'
import { cors } from 'hono/cors'
import "dotenv/config"

const app = new Hono()
const mongoUserName = process.env.USR_MONGO
const mongoUserPWD = process.env.PWD_MONGO
const mongoUri = `mongodb+srv://${mongoUserName}:${mongoUserPWD}@noahsarktest.znrgw.mongodb.net/`
const client = new MongoClient(mongoUri, { monitorCommands: true });
const dbName = 'sample_mflix'

type queryFunc = (col: Collection) => Promise<WithId<Document>[]>

/* Connect to db to query 
 * pass a function type queryFunc for callback
 * */
async function connDB(func: queryFunc): Promise<WithId<Document>[]> {
  try {
    await client.connect()
    console.log('Connected successfully to server');

    const db = client.db(dbName)
    const ction = db.collection('users');
    const res = func(ction)

    return res
  } catch (error) {
    console.error('Error connecting to db or executing query', error);
    throw error
  } 
}

async function showMsg(collection: Collection): Promise<WithId<Document>[]> {
  const findRes = await collection.find({}).limit(5).toArray()
  return findRes;
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

app.use('/users', cors({
  origin: ['http://localhost:4200']
}))
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

serve({
  fetch: app.fetch,
  port: 3000
}, async (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
