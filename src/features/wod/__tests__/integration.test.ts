import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { Entry, General, WOD } from 'features';
import { omit } from 'lodash';
import {
  ENTRIES,
  executeOperation,
  setupMockDB,
  teardownDB,
} from 'tests/utils';
import resolvers from '../resolvers';

const server = new ApolloServer({
  typeDefs: [General, Entry, WOD],
  resolvers,
});

describe('wod feature', () => {
  beforeAll(async () => await setupMockDB());

  afterAll(async () => await teardownDB());

  it('handles wordOfTheDay queries', async () => {
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
          alwaysHonorific
        }
      }
    `;

    const { errors, data } = await executeOperation(server, query);

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.wordOfTheDay).toEqual({
      id: ENTRIES[0]._id.toString(),
      ...omit(ENTRIES[0], ['_id']),
      antonyms: null,
      synonyms: null,
      examples: null,
      note: null,
      regular: null,
    });
  });
});
