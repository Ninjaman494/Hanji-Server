import { ApolloServer, gql } from 'apollo-server';
import {
  connectDB,
  entrySuggestionsCollection,
} from 'datasources/databaseWrapper';
import { Entry, EntrySuggestion, General } from 'features';
import { MongoClient, ObjectId } from 'mongodb';
import resolvers from '../resolvers';

const entry = {
  _id: new ObjectId(),
  term: '가다',
  pos: 'Verb',
  definitions: ['to go'],
};

const suggestion = {
  antonyms: ['오다'],
  examples: [
    {
      sentence: '가고 싶어요',
      translation: 'I want to go',
    },
  ],
};

const server = new ApolloServer({
  typeDefs: [General, Entry, EntrySuggestion],
  resolvers,
});

let mongoClient: MongoClient;

describe('entrySuggestion feature', () => {
  beforeAll(async () => {
    process.env.MONGO_URL = (global as any).__MONGO_URI__;
    mongoClient = await connectDB();
    const wordsCollection = mongoClient.db('hanji').collection('words');
    await wordsCollection.createIndex({ definitions: 'text' });
    await wordsCollection.insertOne(entry);
  });

  afterAll(async () => await mongoClient.close());

  it('handles createEntrySuggestion mutations', async () => {
    const query = gql`
      mutation CreateEntrySuggestion($suggestion: EntrySuggestionInput!) {
        createEntrySuggestion(suggestion: $suggestion) {
          success
          message
        }
      }
    `;

    const { errors, data } = await server.executeOperation({
      query,
      variables: {
        suggestion: {
          ...suggestion,
          entryID: entry._id.toString(),
        },
      },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.createEntrySuggestion).toEqual({
      success: true,
      message: 'Entry suggestion successfully created',
    });

    // Verify suggestion was created
    const docs = await entrySuggestionsCollection().find().toArray();
    expect(docs.length).toEqual(1);
    expect(docs[0]).toEqual({
      ...suggestion,
      _id: expect.anything(),
      entryID: entry._id,
      synonyms: null,
    });
  });
});
