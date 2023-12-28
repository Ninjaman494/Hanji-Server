import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { Entry, General, Search } from 'features';
import { defaults, omit } from 'lodash';
import * as databaseWrapper from 'datasources/databaseWrapper';
import {
  ENTRIES,
  executeOperation,
  setupMockDB,
  teardownDB,
} from 'tests/utils';
import resolvers from '../resolvers';
import { entryReducer } from 'features/utils';

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
  it('handles search queries in English', async () => {
    const entries = ENTRIES.map(entryReducer);
    jest.spyOn(databaseWrapper, 'wordsCollection').mockReturnValueOnce({
      aggregate: () => ({ map: () => ({ toArray: () => entries }) }),
    } as any);

    const { errors, data } = await executeOperation(server, query, {
      query: 'to go',
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.search).toEqual({
      cursor: 3,
      results: entries.map((e) =>
        defaults(e, {
          antonyms: null,
          synonyms: null,
          examples: null,
          note: null,
          regular: null,
        }),
      ),
    });
  });

  it('handles search queries in Korean', async () => {
    await setupMockDB();

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

    await teardownDB();
  });
});
