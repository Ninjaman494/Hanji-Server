import {
  createRateLimitDirective,
  createRateLimitTypeDef,
} from 'graphql-rate-limit-directive';
import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import casual from 'casual';
import DatabaseAPI from '../datasources/database';
import resolvers from '../resolvers';
import typeDefs from '../schema';

const createTestServer = (dataSources) => {
  const server = new ApolloServer({
    typeDefs: [createRateLimitTypeDef(), typeDefs],
    resolvers,
    schemaDirectives: {
      rateLimit: createRateLimitDirective(),
    },
    dataSources: () => dataSources,
  } as any);

  return createTestClient(server as never);
};

describe('Queries', () => {
  test('Fetch full word of the day', async () => {
    const wod = {
      id: casual.uuid,
      term: casual.word,
      pos: casual.word,
      definitions: casual.array_of_words(3),
      examples: [
        {
          sentence: casual.sentence,
          translation: casual.sentence,
        },
      ],
      antonyms: casual.array_of_words(3),
      synonyms: casual.array_of_words(3),
      regular: casual.boolean,
      note: casual.sentence,
    };

    const databaseAPI = new DatabaseAPI(null);
    databaseAPI.fetchWordoftheDay = () => Promise.resolve(wod);

    const { query } = createTestServer({ databaseAPI });
    const GET_WOD = gql`
      query getWOD {
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

    const res = await query({ query: GET_WOD });
    expect(res.data).not.toBe(null);
    expect(res.data.wordOfTheDay).not.toBe(null);
    expect(res.data.wordOfTheDay).toEqual(wod);
  });
});
