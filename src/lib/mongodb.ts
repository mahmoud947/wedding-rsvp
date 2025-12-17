import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('❌ Missing environment variable: MONGODB_URI');
}

const uri: string = process.env.MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 10_000,
  maxPoolSize: 10,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * Extend the NodeJS global object
 * to cache the MongoDB connection across hot reloads & serverless invocations
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  const client = await clientPromise;

  const dbName: string = process.env.MONGODB_DB_NAME ?? "wedding";
  const db: Db = client.db(dbName);

  return { client, db };
}