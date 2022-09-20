import { connectDB } from 'datasources/databaseWrapper';
import { omit } from 'lodash';
import { MongoClient, ObjectId } from 'mongodb';
import resolvers from '../resolvers';

const entries = [
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
  ...Array.from({ length: 20 }, () => ({
    _id: new ObjectId(),
    term: '오다',
    pos: 'Verb',
    definitions: ['to go out'],
  })),
];

let mongoClient: MongoClient;

describe('search resolver', () => {
  beforeAll(async () => {
    process.env.MONGO_URL = (global as any).__MONGO_URI__;
    mongoClient = await connectDB();
    const wordsCollection = mongoClient.db('hanji').collection('words');
    await wordsCollection.createIndex({ definitions: 'text' });
    await wordsCollection.insertMany(entries);
  });

  afterAll(async () => await mongoClient.close());

  it('resolves English search queries', async () => {
    const { results, cursor } = await (resolvers.Query.search as any)(null, {
      query: 'kimchi',
    });

    const { _id, ...rest } = entries[0];
    expect(results.length).toEqual(1);
    expect(cursor).toEqual(1);
    expect(omit(results[0], ['score'])).toEqual({
      id: _id.toString(),
      ...rest,
    });
  });

  it('resolves Korean search queries', async () => {
    const { results, cursor } = await (resolvers.Query.search as any)(null, {
      query: '김지',
    });

    const { _id, ...rest } = entries[0];
    expect(results.length).toEqual(1);
    expect(cursor).toEqual(1);
    expect(omit(results[0], ['score'])).toEqual({
      id: _id.toString(),
      ...rest,
    });
  });

  it('can paginate search results', async () => {
    // First page
    const { results, cursor } = await (resolvers.Query.search as any)(null, {
      query: 'to go',
    });

    const toGoEntry = omit(entries[1], ['score', '_id']);
    const toGoOutEntry = omit(entries[2], ['score', '_id']);

    expect(results.length).toEqual(20);
    expect(cursor).toEqual(20);
    expect(omit(results[0], ['score', 'id'])).toEqual(toGoEntry);
    expect(omit(results[1], ['score', 'id'])).toEqual(toGoOutEntry);

    // Second page
    const { results: paginatedResults, cursor: paginatedCursor } = await (
      resolvers.Query.search as any
    )(null, { query: 'to go', cursor });

    expect(paginatedResults.length).toEqual(1);
    expect(paginatedCursor).toEqual(21);
    expect(omit(paginatedResults[0], ['score', 'id'])).toEqual(toGoOutEntry);

    // Last page, should be empty
    const { results: noResults, cursor: noCursor } = await (
      resolvers.Query.search as any
    )(null, { query: 'to go', cursor: paginatedCursor });

    expect(noResults.length).toEqual(0);
    expect(noCursor).toEqual(-1);
  });
});