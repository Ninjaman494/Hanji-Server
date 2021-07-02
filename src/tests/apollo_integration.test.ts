import {
  createRateLimitDirective,
  createRateLimitTypeDef,
} from 'graphql-rate-limit-directive';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
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
      rateLimit:
        createRateLimitDirective() as unknown as typeof SchemaDirectiveVisitor,
    },
    dataSources: () => dataSources,
  });

  return createTestClient(server as any);
};

describe('Queries', () => {
  test('Fetch single full entry', async () => {
    const entry = {
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

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntry = () => Promise.resolve(entry);

    const { query } = createTestServer({ databaseAPI });
    const GET_ENTRY = gql`
      query getEntry($id: ID!) {
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

    const res = await query({ query: GET_ENTRY, variables: { id: 1 } });
    expect(res.data).not.toBe(null);
    expect(res.data.entry).not.toBe(null);
    expect(res.data.entry).not.toBe(undefined);
    expect(res.data.entry).toEqual(entry);
  });

  test('Fetch single incomplete entry', async () => {
    const entry = {
      id: casual.uuid,
      term: casual.word,
      pos: casual.word,
      definitions: casual.array_of_words(3),
    };

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntry = () => Promise.resolve(entry);

    const { query } = createTestServer({ databaseAPI });
    const GET_ENTRY = gql`
      query getEntry($id: ID!) {
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

    const res = await query({ query: GET_ENTRY, variables: { id: 1 } });
    expect(res.data).not.toBe(null);
    expect(res.data.entry).not.toBe(null);
    expect(res.data.entry).not.toBe(undefined);
    expect(res.data.entry).toEqual({
      ...entry,
      antonyms: null,
      synonyms: null,
      examples: null,
      regular: null,
      note: null,
    });
  });

  test('Fetch multiple entries', async () => {
    const term = {
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

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntries = () => Promise.resolve([term, term, term]);

    const { query } = createTestServer({ databaseAPI });
    const GET_ENTRIES = gql`
      query getEntries($term: String!) {
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

    const res = await query({
      query: GET_ENTRIES,
      variables: { term: 'term' },
    });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.entries).not.toBe(null);
    expect(res.data.entries).not.toBe(undefined);

    res.data.entries.forEach((entry) => {
      expect(entry).toEqual(term);
    });
  });

  test('Fetch multiple entries where some are incomplete', async () => {
    const terms = [
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

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntries = () => Promise.resolve(terms);

    const { query } = createTestServer({ databaseAPI });
    const GET_ENTRIES = gql`
      query getEntries($term: String!) {
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

    const res = await query({
      query: GET_ENTRIES,
      variables: { term: 'term' },
    });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.entries).not.toBe(null);
    expect(res.data.entries).not.toBe(undefined);

    expect(res.data.entries[0]).toEqual(terms[0]);
    expect(res.data.entries[1]).toEqual({
      ...terms[1],
      antonyms: null,
      synonyms: null,
      regular: null,
      note: null,
    });
    expect(res.data.entries[2]).toEqual({
      ...terms[2],
      examples: null,
      antonyms: null,
      synonyms: null,
      regular: null,
    });
  });

  test('Fetch examples', async () => {
    const examples = [
      { sentence: casual.sentence, translation: casual.sentence },
      { sentence: casual.sentence, translation: casual.sentence },
      { sentence: casual.sentence, translation: casual.sentence },
    ];

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchExamples = () => Promise.resolve(examples);

    const { query } = createTestServer({ databaseAPI });
    const GET_EXAMPLES = gql`
      query getExamples($id: ID!) {
        examples(id: $id) {
          sentence
          translation
        }
      }
    `;

    const res = await query({ query: GET_EXAMPLES, variables: { id: 'id' } });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.examples).not.toBe(null);
    expect(res.data.examples).not.toBe(undefined);
    expect(res.data.examples).toEqual(examples);
  });

  test('Fetch conjugations', async () => {
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
    conjugationAPI.fetchConjugations = () => [
      conjugation,
      conjugation,
      conjugation,
    ];

    const { query } = createTestServer({ conjugationAPI });
    const GET_CONJUGATIONS = gql`
      query getConjugations(
        $stem: String!
        $isAdj: Boolean!
        $honorific: Boolean!
        $regular: Boolean
        $conjugations: [String]
      ) {
        conjugations(
          stem: $stem
          isAdj: $isAdj
          honorific: $honorific
          regular: $regular
          conjugations: $conjugations
        ) {
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

    const res = await query({
      query: GET_CONJUGATIONS,
      variables: { stem: 'stem', isAdj: true, honorific: true },
    });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.conjugations).not.toBe(null);
    expect(res.data.conjugations).not.toBe(undefined);
    res.data.conjugations.forEach((fetchedConjugation) =>
      expect(fetchedConjugation).toEqual({
        ...conjugation,
        tense: conjugation.tense.toUpperCase(),
        speechLevel: conjugation.speechLevel.toUpperCase().replace(' ', '_'),
      }),
    );
  });

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

  test('Fetch conjugation types', async () => {
    const types = casual.array_of_words(7);

    const conjugationAPI = new ConjugationAPI();
    conjugationAPI.fetchConjugationTypes = () => types;

    const { query } = createTestServer({ conjugationAPI });
    const GET_TYPES = gql`
      query getTypes {
        conjugationTypes
      }
    `;

    const res = await query({ query: GET_TYPES });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.conjugationTypes).not.toBe(null);
    expect(res.data.conjugationTypes).not.toBe(undefined);
    expect(res.data.conjugationTypes).toEqual(types);
  });

  test('Fetch conjugation names', async () => {
    const names = casual.array_of_words(7);

    const conjugationAPI = new ConjugationAPI();
    conjugationAPI.fetchConjugationNames = () => names;

    const { query } = createTestServer({ conjugationAPI });
    const GET_NAMES = gql`
      query getNames {
        conjugationNames
      }
    `;

    const res = await query({ query: GET_NAMES });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.conjugationNames).not.toBe(null);
    expect(res.data.conjugationNames).not.toBe(undefined);
    expect(res.data.conjugationNames).toEqual(names);
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

    const databaseAPI = new DatabaseAPI();
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
      cursor: casual.word,
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
    expect(res.data.search.cursor).toEqual(result.cursor);
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

  test('Fetch stems', async () => {
    const stems = casual.array_of_words(3);

    const conjugationAPI = new ConjugationAPI();
    conjugationAPI.fetchStems = () => stems;

    const { query } = createTestServer({ conjugationAPI });
    const GET_NAMES = gql`
      query StemQuery($query: String!) {
        stems(term: $query)
      }
    `;

    const res = await query({
      query: GET_NAMES,
      variables: { query: 'query' },
    });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.stems).not.toBe(null);
    expect(res.data.stems).not.toBe(undefined);
    expect(res.data.stems).toEqual(stems);
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

    const databaseAPI = new DatabaseAPI();
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

describe('Mutations', () => {
  test('Create an entry suggestion', async () => {
    const suggestion = {
      entryID: casual.uuid,
      antonyms: casual.array_of_words(3),
      synonyms: casual.array_of_words(2),
      examples: [
        {
          sentence: casual.sentence,
          translation: casual.sentence,
        },
      ],
    };

    const mockCreate = jest.fn();
    mockCreate.mockReturnValue({
      success: true,
      message: 'Entry suggestion successfully created',
      suggestion: {
        id: 'id',
        ...suggestion,
      },
    });
    const databaseAPI = new DatabaseAPI();
    databaseAPI.createEntrySuggestion = mockCreate;

    const { mutate } = createTestServer({ databaseAPI });
    const CREATE_SUGGESTION = gql`
      mutation CreateSuggestion($suggestion: EntrySuggestionInput!) {
        createEntrySuggestion(suggestion: $suggestion) {
          success
          message
          entry {
            id
          }
          suggestion {
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
      }
    `;

    const res = await mutate({
      mutation: CREATE_SUGGESTION,
      variables: { suggestion },
    });
    expect(res.data).not.toBe(null);
    expect(res.data.createEntrySuggestion).toBeDefined();

    expect(res.data.createEntrySuggestion.success).toBeTruthy();
    expect(res.data.createEntrySuggestion.message).toEqual(
      'Entry suggestion successfully created',
    );
    expect(res.data.createEntrySuggestion.suggestion).toEqual({
      id: 'id',
      ...suggestion,
    });
  });

  test('Apply an entry suggestion', async () => {
    const suggestion = {
      id: casual.uuid,
      entryID: casual.uuid,
      antonyms: casual.array_of_words(3),
      synonyms: casual.array_of_words(2),
      examples: [
        {
          sentence: casual.sentence,
          translation: casual.sentence,
        },
      ],
    };
    const entry = {
      id: casual.uuid,
      antonyms: suggestion.antonyms,
      synonyms: suggestion.synonyms,
      examples: suggestion.examples,
    };

    const mockApply = jest.fn();
    mockApply.mockReturnValue({
      success: true,
      message: 'Entry suggestion successfully applied',
      entry: entry,
      suggestion: {
        ...suggestion,
        applied: true,
      },
    });
    const databaseAPI = new DatabaseAPI();
    databaseAPI.applyEntrySuggestion = mockApply;

    const { mutate } = createTestServer({ databaseAPI });
    const APPLY_SUGGESTION = gql`
      mutation ApplySuggestion($id: ID!) {
        applyEntrySuggestion(id: $id) {
          success
          message
          entry {
            id
            antonyms
            synonyms
            examples {
              sentence
              translation
            }
          }
          suggestion {
            id
            entryID
            antonyms
            synonyms
            examples {
              sentence
              translation
            }
            applied
          }
        }
      }
    `;

    const res = await mutate({
      mutation: APPLY_SUGGESTION,
      variables: { id: suggestion.id },
    });
    expect(res.data).not.toBe(null);
    expect(res.data.applyEntrySuggestion).toBeDefined();

    expect(res.data.applyEntrySuggestion.success).toBeTruthy();
    expect(res.data.applyEntrySuggestion.message).toEqual(
      'Entry suggestion successfully applied',
    );
    expect(res.data.applyEntrySuggestion.entry).toEqual(entry);
    expect(res.data.applyEntrySuggestion.suggestion).toEqual({
      ...suggestion,
      applied: true,
    });
  });

  test('Edit an entry suggestion', async () => {
    const suggestion = {
      id: casual.uuid,
      entryID: casual.uuid,
      antonyms: casual.array_of_words(3),
      synonyms: casual.array_of_words(2),
      examples: [
        {
          sentence: casual.sentence,
          translation: casual.sentence,
        },
      ],
    };

    const mockEdit = jest.fn();
    mockEdit.mockReturnValue({
      success: true,
      message: 'Entry suggestion successfully edited',
      suggestion: suggestion,
    });
    const databaseAPI = new DatabaseAPI();
    databaseAPI.editEntrySuggestion = mockEdit;

    const { mutate } = createTestServer({ databaseAPI });
    const EDIT_SUGGESTION = gql`
      mutation EditSuggestion($id: ID!, $suggestion: EntrySuggestionInput!) {
        editEntrySuggestion(id: $id, suggestion: $suggestion) {
          success
          message
          suggestion {
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
      }
    `;

    const { id, ...rest } = suggestion;
    const res = await mutate({
      mutation: EDIT_SUGGESTION,
      variables: { id: id, suggestion: rest },
    });
    expect(res.data).not.toBe(null);
    expect(res.data.editEntrySuggestion).toBeDefined();

    expect(res.data.editEntrySuggestion.success).toBeTruthy();
    expect(res.data.editEntrySuggestion.message).toEqual(
      'Entry suggestion successfully edited',
    );
    expect(res.data.editEntrySuggestion.suggestion).toEqual(suggestion);
  });

  test('Delete an entry suggestion', async () => {
    const mockDelete = jest.fn();
    mockDelete.mockReturnValue({
      success: true,
      message: 'Entry suggestion successfully deleted',
    });
    const databaseAPI = new DatabaseAPI();
    databaseAPI.deleteEntrySuggestion = mockDelete;

    const { mutate } = createTestServer({ databaseAPI });
    const DELETE_SUGGESTION = gql`
      mutation DeleteSuggestion($id: ID!) {
        deleteEntrySuggestion(id: $id) {
          success
          message
        }
      }
    `;

    const res = await mutate({
      mutation: DELETE_SUGGESTION,
      variables: { id: casual.uuid },
    });

    expect(res.data?.deleteEntrySuggestion?.success).toBeTruthy();
    expect(res.data?.deleteEntrySuggestion?.message).toEqual(
      'Entry suggestion successfully deleted',
    );
  });
});
