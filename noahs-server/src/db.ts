import { Collection, MongoClient, type WithId, type Document } from 'mongodb'
import "dotenv/config"

const mongoUserName = process.env.USR_MONGO
const mongoUserPWD = process.env.PWD_MONGO
const mongoUri = `mongodb+srv://${mongoUserName}:${mongoUserPWD}@noahsarktest.znrgw.mongodb.net/`
const client = new MongoClient(mongoUri, { monitorCommands: true });
const dbName = 'sample_mflix'

export type queryFunc = (col: Collection) => Promise<WithId<Document>[]>

/* Connect to db to query 
 * pass a function type queryFunc for callback
 */
export async function connDB(func: queryFunc): Promise<WithId<Document>[]> {
  try {
    await client.connect()
    console.log('Connected successfully to server');
    const db = client.db(dbName)
    const collection = db.collection('users');
    const res = func(collection)
    return res
  } catch (error) {
    console.error('Error connecting to db or executing query', error);
    throw error
  } 
}
