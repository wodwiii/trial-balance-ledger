"use server"
import { Db, MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export const connectToDatabase = async () => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('TBLData');
  cachedClient = client;
  cachedDb = db;
  return { client, db };
};
