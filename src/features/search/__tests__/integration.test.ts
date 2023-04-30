import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { Entry, General, Search } from 'features';
import { omit } from 'lodash';
import {
  ENTRIES,
  executeOperation,
  setupMockDB,
  teardownDB,
} from 'tests/utils';
import resolvers from '../resolvers';

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
        alwaysHonorific
      }
    }
  }
`;

const server = new ApolloServer({
  typeDefs: [General, Entry, Search],
  resolvers,
});

describe('search feature', () => {
  beforeAll(async () => await setupMockDB());

  afterAll(async () => await teardownDB());

  it('handles search queries in English', async () => {
    const { errors, data } = await executeOperation(server, query, {
      query: 'to go',
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.search).toEqual({
      cursor: 2,
      results: [
        {
          id: ENTRIES[1]._id.toString(),
          ...omit(ENTRIES[1], ['_id']),
          antonyms: null,
          synonyms: null,
          examples: null,
          note: null,
          regular: null,
        },
        {
          id: ENTRIES[2]._id.toString(),
          ...omit(ENTRIES[2], ['_id']),
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
    const { errors, data } = await executeOperation(server, query, {
      query: '가다',
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.search).toEqual({
      cursor: 1,
      results: [
        {
          id: ENTRIES[1]._id.toString(),
          ...omit(ENTRIES[1], ['_id']),
          antonyms: null,
          synonyms: null,
          examples: null,
          note: null,
          regular: null,
        },
      ],
    });
  });
});
