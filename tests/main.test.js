const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const gql = require('graphql-tag');
const casual = require('casual');
const DatabaseAPI = require('../datasources/database');
const ConjugationAPI = require('../datasources/conjugation');
const resolvers = require('../resolvers');
const typeDefs = require('../schema');

test('Fetch single full entry', async () => {
    const entry = {
        id: casual.uuid,
        term: casual.word,
        pos: casual.word,
        definitions: casual.array_of_words(3),
        examples: [{
            sentence: casual.sentence,
            translation: casual.sentence
        }],
        antonyms: casual.array_of_words(3),
        synonyms: casual.array_of_words(3),
        regular: casual.boolean,
        note: casual.sentence
    };

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntry = () => entry;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ databaseAPI}),
    });

    const { query } = createTestClient(server);
    const GET_ENTRY = gql`
      query getEntry($id: ID!) {
        entry(id: $id) {
            id,
            term,
            pos,
            definitions,
            antonyms,
            synonyms,
            examples {
                sentence,
                translation,
            },
            regular,
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
    databaseAPI.fetchEntry = () => entry;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ databaseAPI}),
    });
    const { query } = createTestClient(server);
    const GET_ENTRY = gql`
      query getEntry($id: ID!) {
        entry(id: $id) {
            id,
            term,
            pos,
            definitions,
            antonyms,
            synonyms,
            examples {
                sentence,
                translation,
            },
            regular,
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
        examples: [{
            sentence: casual.sentence,
            translation: casual.sentence
        }],
        antonyms: casual.array_of_words(3),
        synonyms: casual.array_of_words(3),
        regular: casual.boolean,
        note: casual.sentence
    };

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntries = () => [term, term, term];

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ databaseAPI}),
    });

    const { query } = createTestClient(server);
    const GET_ENTRIES = gql`
      query getEntries($term: String!) {
        entries(term: $term) {
            id,
            term,
            pos,
            definitions,
            antonyms,
            synonyms,
            examples {
                sentence,
                translation,
            },
            regular,
            note
        }
      }
    `;

    const res = await query({ query: GET_ENTRIES, variables: { term: "term" } });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.entries).not.toBe(null);
    expect(res.data.entries).not.toBe(undefined);

    res.data.entries.forEach(entry => {
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
            examples: [{
                sentence: casual.sentence,
                translation: casual.sentence
            }],
            antonyms: casual.array_of_words(3),
            synonyms: casual.array_of_words(3),
            regular: casual.boolean,
            note: casual.sentence
        },
        {
            id: casual.uuid,
            term: casual.word,
            pos: casual.word,
            definitions: casual.array_of_words(3),
            examples: [{
                sentence: casual.sentence,
                translation: casual.sentence
            }],
        },
        {
            id: casual.uuid,
            term: casual.word,
            pos: casual.word,
            definitions: casual.array_of_words(3),
            note: casual.sentence
        }
    ];

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntries = () => terms;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ databaseAPI}),
    });

    const { query } = createTestClient(server);
    const GET_ENTRIES = gql`
      query getEntries($term: String!) {
        entries(term: $term) {
            id,
            term,
            pos,
            definitions,
            antonyms,
            synonyms,
            examples {
                sentence,
                translation,
            },
            regular,
            note
        }
      }
    `;

    const res = await query({ query: GET_ENTRIES, variables: { term: "term" } });
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
        {sentence: casual.sentence, translation: casual.sentence},
        {sentence: casual.sentence, translation: casual.sentence},
        {sentence: casual.sentence, translation: casual.sentence}
    ];

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchExamples = () => examples;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ databaseAPI}),
    });

    const { query } = createTestClient(server);
    const GET_EXAMPLES = gql`
      query getExamples($id: ID!) {
        examples(id: $id) {
            sentence,
            translation
        }
      }
    `;

    const res = await query({ query: GET_EXAMPLES, variables: { id: "id" } });
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
        speechLevel: casual.random_element(['formal low','informal low','informal high','formal high']),
        honorific: casual.boolean,
        pronunciation: casual.word,
        romanization: casual.word,
        reasons: casual.array_of_words(7),
    };

    const conjugationAPI = new ConjugationAPI();
    conjugationAPI.fetchConjugations = () => [conjugation, conjugation, conjugation];

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ conjugationAPI }),
    });

    const { query } = createTestClient(server);
    const GET_CONJUGATIONS = gql`
      query getConjugations($stem: String!, $isAdj: Boolean!, $honorific: Boolean!, $regular: Boolean, $conjugations: [String]) {
        conjugations(stem: $stem, isAdj: $isAdj, honorific: $honorific, regular: $regular, conjugations: $conjugations) {
            name,
            conjugation,
            type,
            tense,
            speechLevel,
            honorific,
            pronunciation,
            romanization,
            reasons
        }
      }
    `;

    const res = await query({
        query: GET_CONJUGATIONS,
        variables: { stem: 'stem', isAdj: true, honorific: true }
    });
    expect(res.data).not.toBe(null);
    expect(res.data).not.toBe(undefined);
    expect(res.data.conjugations).not.toBe(null);
    expect(res.data.conjugations).not.toBe(undefined);
    res.data.conjugations.forEach(fetchedConjugation =>
        expect(fetchedConjugation).toEqual({
            ...conjugation,
            tense: conjugation.tense.toUpperCase(),
            speechLevel: conjugation.speechLevel.toUpperCase().replace(' ','_')
        })
    );
});

test('Fetch conjugation types', async () => {
    const types = casual.array_of_words(7);

    const conjugationAPI = new ConjugationAPI();
    conjugationAPI.fetchConjugationTypes = () => types;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ conjugationAPI}),
    });

    const { query } = createTestClient(server);
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

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ conjugationAPI}),
    });

    const { query } = createTestClient(server);
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
        examples: [{
            sentence: casual.sentence,
            translation: casual.sentence
        }],
        antonyms: casual.array_of_words(3),
        synonyms: casual.array_of_words(3),
        regular: casual.boolean,
        note: casual.sentence
    };

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchWordoftheDay = () => wod;

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({ databaseAPI}),
    });

    const { query } = createTestClient(server);
    const GET_WOD = gql`
      query getWOD {
        wordOfTheDay {
            id,
            term,
            pos,
            definitions,
            antonyms,
            synonyms,
            examples {
                sentence,
                translation,
            },
            regular,
            note
        }
      }
    `;

    const res = await query({ query: GET_WOD });
    expect(res.data).not.toBe(null);
    expect(res.data.wordOfTheDay).not.toBe(null);
    expect(res.data.wordOfTheDay).toEqual(wod);
});