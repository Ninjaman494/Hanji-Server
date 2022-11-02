import { ApolloServer, gql } from 'apollo-server';
import { connectDB } from 'datasources/databaseWrapper';
import { Entry, General, Search } from 'features';
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
    antonyms: ['오다'],
  },
  {
    _id: new ObjectId(),
    term: '오다',
    pos: 'Verb',
    definitions: ['to go out'],
  },
];

const query = gql`
  query Search($query: String!) {
    search(query: $query) {
      cursor
      results {
        id
        term
        pos
        definitions
        antonyms
        synonyms
        examples {
          sentence
          translation
        }
        regular
        note
      }
    }
  }
`;

const server = new ApolloServer({
  typeDefs: [General, Entry, Search],
  resolvers,
});

let mongoClient: MongoClient;

describe('search feature', () => {
  beforeAll(async () => {
    process.env.MONGO_URL = (global as any).__MONGO_URI__;
    mongoClient = await connectDB();
    const wordsCollection = mongoClient.db('hanji').collection('words');
    await wordsCollection.createIndex({ definitions: 'text' });
    await wordsCollection.insertMany(entries);
  });

  afterAll(async () => await mongoClient.close());

  it('handles search queries in English', async () => {
    const { errors, data } = await server.executeOperation({
      query,
      variables: { query: 'to go' },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.search).toEqual({
      cursor: 2,
      results: [
        {
          id: entries[1]._id.toString(),
          ...omit(entries[1], ['_id']),
          synonyms: null,
          examples: null,
          note: null,
          regular: null,
        },
        {
          id: entries[2]._id.toString(),
          ...omit(entries[2], ['_id']),
          antonyms: null,
          synonyms: null,
          examples: null,
          note: null,
          regular: null,
        },
      ],
    });
  });

  it('handles search queries in Korean', async () => {
    const { errors, data } = await server.executeOperation({
      query,
      variables: { query: '가다' },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.search).toEqual({
      cursor: 1,
      results: [
        {
          id: entries[1]._id.toString(),
          ...omit(entries[1], ['_id']),
          synonyms: null,
          examples: null,
          note: null,
          regular: null,
        },
      ],
    });
  });
});
