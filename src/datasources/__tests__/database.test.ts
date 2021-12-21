import DatabaseAPI from '../database';
import { MongoClient, ObjectId } from 'mongodb';

describe('DatabaseAPI Datasource', () => {
  let mongoClient: MongoClient;

  beforeAll(async () => {
    mongoClient = new MongoClient((global as any).__MONGO_URI__);
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  describe('read operations', () => {
    const verbId = new ObjectId();
    const verbEntry = {
      term: '가다',
      pos: 'Verb',
      definitions: ['to go'],
      antonyms: ['오다'],
      examples: [
        {
          sentence: 'I go',
          translation: '저는 가요',
        },
      ],
    };

    const nounId = new ObjectId();
    const nounEntry = {
      term: '사과',
      pos: 'Noun',
      definitions: ['apple'],
    };

    beforeAll(async () => {
      await mongoClient
        .db('hanji')
        .collection('words')
        .insertOne({
          _id: verbId,
          ...verbEntry,
        });

      await mongoClient
        .db('hanji')
        .collection('words')
        .insertOne({
          _id: nounId,
          ...nounEntry,
        });
    });

    it('fetches an entry', async () => {
      const datasource = new DatabaseAPI(mongoClient);

      const { id, ...rest } = await datasource.fetchEntry(verbId);

      expect(id).toEqual(verbId.toString());
      expect(rest).toEqual(verbEntry);
    });
  });
});
