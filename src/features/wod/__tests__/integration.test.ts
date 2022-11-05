import { ApolloServer, gql } from 'apollo-server';
import { connectDB, wordsCollection } from 'datasources/databaseWrapper';
import { Entry, General, WOD } from 'features';
import { map } from 'lodash';
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
  typeDefs: [General, Entry, WOD],
  resolvers,
});

let mongoClient: MongoClient;

const mockDate = (date: Date) =>
  jest.spyOn(global, 'Date').mockImplementation(() => date as any);

describe('wod feature', () => {
  beforeAll(async () => {
    process.env.MONGO_URL = (global as any).__MONGO_URI__;
    mongoClient = await connectDB();
    const wordsCollection = mongoClient.db('hanji').collection('words');
    await wordsCollection.createIndex({ definitions: 'text' });
    await wordsCollection.insertMany(entries);
  });

  afterAll(async () => await mongoClient.close());

  it('fetches the same wod within 24 hours', async () => {
    const spy = mockDate(new Date('2000-01-01T00:00:00'));

    const query = gql`
      query WOD {
        wordOfTheDay {
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

    const { errors, data } = await server.executeOperation({ query });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(map(entries, ({ term }) => term)).toContain(data.wordOfTheDay.term);

    // Move forward 23 hours and refetch
    spy.mockRestore();
    mockDate(new Date('2000-01-01T23:00:00'));
    const { errors: newErrors, data: newData } = await server.executeOperation({
      query,
    });

    expect(newErrors).toBeUndefined();
    expect(newData).toBeDefined();
    expect(newData.wordOfTheDay).toEqual(data.wordOfTheDay);
  });

  it('fetches a different wod after 24 hours', async () => {
    const spy = mockDate(new Date('2000-01-01T00:00:00'));

    const query = gql`
      query WOD {
        wordOfTheDay {
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

    const { errors, data } = await server.executeOperation({ query });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(map(entries, ({ term }) => term)).toContain(data.wordOfTheDay.term);

    // Delete so it doesn't pick the same wod twice
    await wordsCollection().deleteOne({ _id: data._id });

    // Move forward 25 hours and refetch
    spy.mockRestore();
    mockDate(new Date('2000-01-02T01:00:00'));
    const { errors: newErrors, data: newData } = await server.executeOperation({
      query,
    });

    expect(newErrors).toBeUndefined();
    expect(newData).toBeDefined();
    expect(newData.wordOfTheDay).not.toEqual(data.wordOfTheDay);
    expect(map(entries, ({ term }) => term)).toContain(
      newData.wordOfTheDay.term,
    );
  });
});
