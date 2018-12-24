module.exports = {
    Query: {
        entries: async (_, { term }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntries(term),
        entry: (_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchEntry(id),
        examples:(_, { id }, { dataSources }) =>
            dataSources.databaseAPI.fetchExamples(id),
        conjugation:(_, {stem, regular, isAdj }, { dataSources }) =>
            dataSources.conjugationAPI.fetchConjugations(stem,regular,isAdj),
    },
    Tense: {
        PRESENT: 'present',
        PAST: 'past',
        FUTURE: 'future',
        NONE: 'none',
    },
    SpeechLevel: {
        FORMAL_NON_POLITE: 'formal low',
        INFORMAL_NON_POLITE: 'informal low',
        INFORMAL_POLITE: 'informal high',
        FORMAL_POLITE: 'formal high',
        NONE: 'none'
    }
};