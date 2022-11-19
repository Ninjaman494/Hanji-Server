import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { entrySuggestionsCollection } from 'datasources/databaseWrapper';
import { Entry, EntrySuggestion, General } from 'features';
import {
  ENTRIES,
  executeOperation,
  setupMockDB,
  teardownDB,
} from 'tests/utils';
import resolvers from '../resolvers';

const entryID = ENTRIES[0]._id;

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

describe('entrySuggestion feature', () => {
  beforeAll(async () => await setupMockDB());

  afterAll(async () => await teardownDB());

  it('handles createEntrySuggestion mutations', async () => {
    const query = gql`
      mutation CreateEntrySuggestion($suggestion: EntrySuggestionInput!) {
        createEntrySuggestion(suggestion: $suggestion) {
          success
          message
        }
      }
    `;

    const { errors, data } = await executeOperation(server, query, {
      suggestion: {
        ...suggestion,
        entryID: entryID.toString(),
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
      entryID: entryID,
      synonyms: null,
    });
  });
});
