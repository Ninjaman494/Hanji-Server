const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const gql = require('graphql-tag');
const casual = require('casual');
const DatabaseAPI = require('../datasources/database');
const resolvers = require('../resolvers');
const typeDefs = require('../schema');

test('Fetch single full entry', async () => {
    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntry = function(id) {
        return {
            id: id,
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
        }
    };

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
    // Required
    expect(typeof res.data.entry.id).toBe('string');
    expect(typeof res.data.entry.term).toBe('string');
    expect(typeof res.data.entry.pos).toBe('string');
    expect(Array.isArray(res.data.entry.definitions)).toBe(true);

    // Optional
    expect(Array.isArray(res.data.entry.synonyms)).toBe(true);
    expect(Array.isArray(res.data.entry.antonyms)).toBe(true);
    expect(typeof res.data.entry.examples).not.toBe(null);
    expect(typeof res.data.entry.regular).toBe('boolean');
    expect(typeof res.data.entry.note).toBe('string');
});

test('Fetch single incomplete entry', async () => {
    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntry = function(id) {
        return {
            id: id,
            term: casual.word,
            pos: casual.word,
            definitions: casual.array_of_words(3)
        }
    };

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

    // run query against the server and snapshot the output
    const res = await query({ query: GET_ENTRY, variables: { id: 1 } });
    expect(res.data).not.toBe(null);
    expect(res.data.entry).not.toBe(null);
    // Required
    expect(typeof res.data.entry.id).toBe('string');
    expect(typeof res.data.entry.term).toBe('string');
    expect(typeof res.data.entry.pos).toBe('string');
    expect(Array.isArray(res.data.entry.definitions)).toBe(true);

    // Optional
    expect(res.data.entry.synonyms).toBe(null);
    expect(res.data.entry.antonyms).toBe(null);
    expect(res.data.entry.examples).toBe(null);
    expect(res.data.entry.regular).toBe(null);
    expect(res.data.entry.note).toBe(null);
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
    }

    const databaseAPI = new DatabaseAPI();
    databaseAPI.fetchEntries = (query) => [term, term, term]

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
    expect(res.data).not.toBe(undefined)
    expect(res.data.entries).not.toBe(null);
    expect(res.data.entries).not.toBe(undefined);

    res.data.entries.forEach(entry => {
        expect(entry).toEqual(term);
    })
})