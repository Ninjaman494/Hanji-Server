import { connectDB } from './datasources/databaseWrapper';
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

(async function () {
  const mongoClient = await connectDB();
  const wordsCollection = mongoClient.db('hanji').collection('words');
  await wordsCollection.createIndex({ definitions: 'text' });
  await wordsCollection.insertMany(ENTRIES);
})();

// afterAll(async () => {
//   await mongoClient.close();
// });
