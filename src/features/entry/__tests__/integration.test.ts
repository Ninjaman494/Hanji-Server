import { ApolloServer, gql } from 'apollo-server';
import { connectDB } from 'datasources/databaseWrapper';
import { Entry, General } from 'features';
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

const server = new ApolloServer({
  typeDefs: [General, Entry],
  resolvers,
});

let mongoClient: MongoClient;

describe('entry feature', () => {
  beforeAll(async () => {
    process.env.MONGO_URL = (global as any).__MONGO_URI__;
    mongoClient = await connectDB();
    const wordsCollection = mongoClient.db('hanji').collection('words');
    await wordsCollection.createIndex({ definitions: 'text' });
    await wordsCollection.insertMany(entries);
  });

  afterAll(async () => await mongoClient.close());

  it('handles entries queries', async () => {
    const query = gql`
      query Entries($term: String!) {
        entries(term: $term) {
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
    `;

    const { errors, data } = await server.executeOperation({
      query,
      variables: { term: '가다' },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.entries).toEqual([
      {
        id: entries[1]._id.toString(),
        ...omit(entries[1], ['_id']),
        synonyms: null,
        examples: null,
        note: null,
        regular: null,
      },
    ]);
  });

  it('handles entry queries', async () => {
    const query = gql`
      query Entry($id: ID!) {
        entry(id: $id) {
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
    `;

    const { _id, ...rest } = entries[0];

    const { errors, data } = await server.executeOperation({
      query,
      variables: { id: _id.toString() },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.entry).toEqual({
      id: _id.toString(),
      ...rest,
      antonyms: null,
      synonyms: null,
      examples: null,
      note: null,
      regular: null,
    });
  });
});
