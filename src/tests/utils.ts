import { connectDB, wordsCollection } from 'datasources/databaseWrapper';
import { Entry } from 'generated/graphql';
import { MongoClient, ObjectId } from 'mongodb';

export const ENTRIES = [
  {
    _id: new ObjectId(),
    term: '김지',
    pos: 'Verb',
    definitions: ['kimchi'],
  },
  {
    _id: new ObjectId(),
    term: '가다',
    pos: 'Verb',
    definitions: ['to go'],
  },
  {
    _id: new ObjectId(),
    term: '오다',
    pos: 'Verb',
    definitions: ['to come and go'],
  },
];

let mongoClient: MongoClient;

/** Sets up mock DB and collections. Use only in tests */
export const setupMockDB = async (
  entries?: (Omit<Entry, 'id'> & { _id: ObjectId })[],
) => {
  mongoClient = await connectDB();

  const collection = wordsCollection();
  await collection.createIndex({ definitions: 'text' });
  await collection.insertMany(entries ?? ENTRIES);

  return mongoClient;
};

/** Tears down mock DB. Use only in tests */
export const teardownDB = async () => {
  await mongoClient.close();
};
