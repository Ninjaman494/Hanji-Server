import DatabaseAPI from '../database';
import { MongoClient, ObjectId } from 'mongodb';

describe('DatabaseAPI Datasource', () => {
  let mongoClient: MongoClient;
  let datasource: DatabaseAPI;

  beforeAll(async () => {
    mongoClient = new MongoClient((global as any).__MONGO_URI__);
    datasource = new DatabaseAPI(mongoClient);
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

    const suggestionId = new ObjectId();
    const suggestionEntry = {
      entryID: verbId,
      antonyms: verbEntry.antonyms,
      examples: verbEntry.examples,
    };

    beforeAll(async () => {
      await mongoClient.db('hanji').collection('words').deleteMany({});
      await mongoClient.db('hanji').collection('words').createIndex({
        definitions: 'text',
      });

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

      await mongoClient
        .db('hanji')
        .collection('words-suggestions')
        .insertOne({
          _id: suggestionId,
          ...suggestionEntry,
        });
    });

    test('fetchEntry', async () => {
      const doc = await datasource.fetchEntry(verbId);
      expectDocEquals(doc, verbId, verbEntry);
    });

    test('fetchEntries', async () => {
      const entries = await datasource.fetchEntries(nounEntry.term);

      expect(entries.length).toEqual(1);
      expectDocEquals(entries[0], nounId, nounEntry);
    });

    test('fetchExamples', async () => {
      const examples = await datasource.fetchExamples(verbId);
      expect(examples).toEqual(verbEntry.examples);
    });

    test('searchEnglish', async () => {
      const { results, cursor } = await datasource.searchEnglish('to go');

      expect(cursor).toEqual(1);
      expect(results.length).toEqual(1);
      expectDocEquals(results[0], verbId, { score: 1, ...verbEntry });
    });

    test('fetchWordoftheDay', async () => {
      const doc = await datasource.fetchWordoftheDay();

      doc.id === verbId.toString()
        ? expectDocEquals(doc, verbId, verbEntry)
        : expectDocEquals(doc, nounId, nounEntry);
    });

    test('fetchEntrySuggestion', async () => {
      const doc = await datasource.fetchEntrySuggestion(suggestionId);
      const { entryID, ...rest } = suggestionEntry;

      expectDocEquals(doc, suggestionId, {
        applied: false,
        entryID: entryID.toString(),
        ...rest,
      });
    });

    test('fetchEntrySuggestions', async () => {
      const suggestions = await datasource.fetchEntrySuggestions();

      const { entryID, ...rest } = suggestionEntry;
      expect(suggestions.length).toEqual(1);
      expectDocEquals(suggestions[0], suggestionId, {
        applied: false,
        entryID: entryID.toString(),
        ...rest,
      });
    });
  });
});

const expectDocEquals = (
  { id, ...rest }: Record<string, any>,
  entryId: ObjectId,
  entry: any,
) => {
  expect(id).toEqual(entryId.toString());
  expect(rest).toEqual(entry);
};
