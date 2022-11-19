import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { Entry, General } from 'features';
import { omit } from 'lodash';
import {
  ENTRIES,
  executeOperation,
  setupMockDB,
  teardownDB,
} from 'tests/utils';
import resolvers from '../resolvers';

const server = new ApolloServer({
  typeDefs: [General, Entry],
  resolvers,
});

describe('entry feature', () => {
  beforeAll(async () => await setupMockDB());
  afterAll(async () => await teardownDB());

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

    const { errors, data } = await executeOperation(server, query, {
      term: '가다',
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.entries).toEqual([
      {
        id: ENTRIES[1]._id.toString(),
        ...omit(ENTRIES[1], ['_id']),
        antonyms: null,
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

    const { _id, ...rest } = ENTRIES[0];

    const { errors, data } = await executeOperation(server, query, {
      id: _id.toString(),
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
