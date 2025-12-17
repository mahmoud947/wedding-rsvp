import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {
  serverSelectionTimeoutMS: 10_000,
  maxPoolSize: 10,
};

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('❌ Missing environment variable: "MONGODB_URI"');
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  const client = await global._mongoClientPromise;

  const dbName = process.env.MONGODB_DB_NAME ?? "wedding";
  const db: Db = client.db(dbName);

  return { client, db };
}