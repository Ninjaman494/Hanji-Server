import { ApolloServer } from '@apollo/server';
import {
  connectDB,
  globalCollection,
  wordsCollection,
} from 'datasources/databaseWrapper';
import { Entry } from 'generated/graphql';
import { DocumentNode } from 'graphql';
import { MongoClient, ObjectId } from 'mongodb';

export const ENTRIES = [
  {
    _id: new ObjectId(),
    term: '김지',
    pos: 'Verb',
    definitions: ['kimchi'],
    alwaysHonorific: false,
  },
  {
    _id: new ObjectId(),
    term: '가다',
    pos: 'Verb',
    definitions: ['to go'],
    alwaysHonorific: false,
  },
  {
    _id: new ObjectId(),
    term: '오다',
    pos: 'Verb',
    definitions: ['to come and go'],
    alwaysHonorific: false,
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

  await globalCollection().insertOne({
    _id: 'wod' as any,
    entryID: ENTRIES[0]._id,
    updated: new Date(),
  });

  return mongoClient;
};

/** Tears down mock DB. Use only in tests */
export const teardownDB = async () => {
  await mongoClient.close();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeOperation = async <TData = any, Targs = any>(
  server: ApolloServer,
  query: DocumentNode,
  variables?: Targs,
) => {
  const { body } = await server.executeOperation<TData, Targs>({
    query,
    variables,
  });

  if (body.kind === 'incremental')
    throw new Error('response kind is incremental');

  return body.singleResult;
};
