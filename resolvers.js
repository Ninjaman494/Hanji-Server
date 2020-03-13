module.exports = {
    Query: {
        entries: async (_, { term }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntries(term),
        entry: (_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntry(id),
        examples:(_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchExamples(id),
        conjugations:(_, {stem, isAdj, honorific, regular, conjugations }, { dataSources }) =>
            dataSources.conjugationAPI.fetchConjugations(stem,isAdj, honorific, regular, conjugations),
        conjugationTypes: (_,{},{ dataSources }) =>
            dataSources.conjugationAPI.fetchConjugationTypes(),
        conjugationNames: (_,{}, { dataSources }) =>
            dataSources.conjugationAPI.fetchConjugationNames(),
        search:(_, { query, cursor }, { dataSources }) =>
            dataSources.searchAPI.search(query, cursor),
        wordOfTheDay:(_,{},{ dataSources }) =>
            dataSources.databaseAPI.fetchWordoftheDay()
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