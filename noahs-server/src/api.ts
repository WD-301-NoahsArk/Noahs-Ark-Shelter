import { Collection, type WithId, type Document } from 'mongodb'

export async function showMsg(collection: Collection): Promise<WithId<Document>[]> {
  const findRes = await collection.find({}).limit(5).toArray()
  return findRes;
}
