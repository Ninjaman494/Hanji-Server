import {
  createRateLimitDirective,
  createRateLimitTypeDef,
} from 'graphql-rate-limit-directive';
import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import casual from 'casual';
import DatabaseAPI from '../datasources/database';
import ConjugationAPI from '../datasources/conjugation';
import SearchAPI from '../datasources/search';
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
  test('Fetch favorites', async () => {
    const conjugation = {
      name: casual.word,
      conjugation: casual.word,
      type: casual.word,
      tense: casual.random_element(['present', 'past', 'future']),
      speechLevel: casual.random_element([
        'formal low',
        'informal low',
        'informal high',
        'formal high',
      ]),
      honorific: casual.boolean,
      pronunciation: casual.word,
      romanization: casual.word,
      reasons: casual.array_of_words(7),
    };

    const conjugationAPI = new ConjugationAPI();
    conjugationAPI.fetchFavorites = () => [
      conjugation,
      conjugation,
      conjugation,
    ];

    const { query } = createTestServer({ conjugationAPI });
    const GET_FAVORITES = gql`
      query getFavorites(
        $stem: String!
        $isAdj: Boolean!
        $favorites: [FavInput]!
      ) {
        favorites(stem: $stem, isAdj: $isAdj, favorites: $favorites) {
          name
          conjugation
          type
          tense
          speechLevel
          honorific
          pronunciation
          romanization
          reasons
        }
      }
    `;

    const favorites = [
      {
        name: casual.word,
        conjugationName: casual.word,
        honorific: casual.boolean,
      },
    ];
    const res = await query({
      query: GET_FAVORITES,
      variables: { stem: 'stem', isAdj: true, favorites: favorites },
    });

    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.favorites).not.toBe(null);
    expect(res.data.favorites).not.toBe(undefined);
    res.data.favorites.forEach((fetchedConjugation) =>
      expect(fetchedConjugation).toEqual({
        ...conjugation,
        tense: conjugation.tense.toUpperCase(),
        speechLevel: conjugation.speechLevel.toUpperCase().replace(' ', '_'),
      }),
    );
  });

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

  test('Do a search', async () => {
    const entries = [
      {
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
      },
      {
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
      },
      {
        id: casual.uuid,
        term: casual.word,
        pos: casual.word,
        definitions: casual.array_of_words(3),
        note: casual.sentence,
      },
    ];
    const result = {
      cursor: 20,
      results: entries,
    };

    const searchAPI = new SearchAPI(null);
    searchAPI.search = () => Promise.resolve(result);

    const { query } = createTestServer({ searchAPI });
    const SEARCH = gql`
      query search($query: String!, $cursor: Int) {
        search(query: $query, cursor: $cursor) {
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

    const res = await query({
      query: SEARCH,
      variables: { query: 'query', cursor: 0 },
    });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.search).not.toBe(null);
    expect(res.data.search).not.toBe(undefined);
    expect(res.data.search.cursor).toEqual(result.cursor.toString());
    expect(res.data.search.results[0]).toEqual(entries[0]);
    expect(res.data.search.results[1]).toEqual({
      ...entries[1],
      antonyms: null,
      synonyms: null,
      regular: null,
      note: null,
    });
    expect(res.data.search.results[2]).toEqual({
      ...entries[2],
      examples: null,
      antonyms: null,
      synonyms: null,
      regular: null,
    });
  });

  test('Fetch entry suggestions', async () => {
    const suggestions = [
      {
        id: 'suggestion 1',
        entryID: 'entry 1',
        antonyms: ['antonym'],
        synonyms: ['synonym'],
        examples: [
          {
            sentence: 'sentence',
            translation: 'translation',
          },
        ],
      },
      {
        id: 'suggestion 2',
        entryID: 'entry 2',
        antonyms: ['antonym'],
      },
      {
        id: 'suggestion 3',
        entryID: 'entry 3',
        examples: [
          {
            sentence: 'sentence',
            translation: 'translation',
          },
        ],
      },
    ];

    const databaseAPI = new DatabaseAPI(null);
    databaseAPI.fetchEntrySuggestions = () => Promise.resolve(suggestions);

    const { query } = createTestServer({ databaseAPI });
    const GET_SUGGESTIONS = gql`
      query getSuggestions {
        entrySuggestions {
          id
          entryID
          antonyms
          synonyms
          examples {
            sentence
            translation
          }
        }
      }
    `;

    const res = await query({ query: GET_SUGGESTIONS });
    expect(res.data).not.toBe(null);
    expect(res.data.entrySuggestions).toBeDefined();

    expect(res.data.entrySuggestions[0]).toEqual(suggestions[0]);
    expect(res.data.entrySuggestions[1]).toEqual({
      synonyms: null,
      examples: null,
      ...suggestions[1],
    });
    expect(res.data.entrySuggestions[2]).toEqual({
      synonyms: null,
      antonyms: null,
      ...suggestions[2],
    });
  });
});
