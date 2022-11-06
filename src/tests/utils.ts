import { ObjectId } from 'mongodb';

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
    definitions: ['to go out'],
  },
];

// let mongoClient: MongoClient;

// /** Sets up mock DB and collections. Use only in tests */
// export const setupMockDB = async (
//   entries?: (Omit<Entry, 'id'> & { _id: ObjectId })[],
// ) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   process.env.MONGO_URL = (global as any).__MONGO_URI__;
//   mongoClient = await connectDB();
//   const wordsCollection = mongoClient.db('hanji').collection('words');
//   await wordsCollection.createIndex({ definitions: 'text' });
//   await wordsCollection.insertMany(entries ?? ENTRIES);

//   return mongoClient;
// };

// /** Tears down mock DB. Use only in tests */
// export const teardownDB = async () => {
//   await mongoClient.close();
// };
