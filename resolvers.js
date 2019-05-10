module.exports = {
    Query: {
        entries: async (_, { term }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntries(term),
        entry: (_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntry(id),
        examples:(_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchExamples(id),
        conjugation:(_, {stem, isAdj, honorific, regular }, { dataSources }) =>
            dataSources.conjugationAPI.fetchConjugations(stem,isAdj, honorific, regular),
        search:(_, { query }, { dataSources }) =>
            dataSources.searchAPI.search(query)
    },
    Tense: {
        PRESENT: 'present',
        PAST: 'past',
        FUTURE: 'future',
        NONE: 'none',
    },
    SpeechLevel: {
        FORMAL_LOW: 'formal low',
        INFORMAL_LOW: 'informal low',
        INFORMAL_HIGH: 'informal high',
        FORMAL_HIGH: 'formal high',
        NONE: 'none'
    }
};