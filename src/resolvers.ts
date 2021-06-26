export default {
  Query: {
    entries: async (_, { term }, { dataSources }) =>
      dataSources.databaseAPI.fetchEntries(term),
    entry: (_, { id }, { dataSources }) =>
      dataSources.databaseAPI.fetchEntry(id),
    examples: (_, { id }, { dataSources }) =>
      dataSources.databaseAPI.fetchExamples(id),
    conjugations: (
      _,
      { stem, isAdj, honorific, regular, conjugations },
      { dataSources },
    ) =>
      dataSources.conjugationAPI.fetchConjugations(
        stem,
        isAdj,
        honorific,
        regular,
        conjugations,
      ),
    favorites: (_, { stem, isAdj, regular, favorites }, { dataSources }) =>
      dataSources.conjugationAPI.fetchFavorites(
        stem,
        isAdj,
        regular,
        favorites,
      ),
    conjugationTypes: (_, {}, { dataSources }) =>
      dataSources.conjugationAPI.fetchConjugationTypes(),
    conjugationNames: (_, {}, { dataSources }) =>
      dataSources.conjugationAPI.fetchConjugationNames(),
    search: (_, { query, cursor }, { dataSources }) =>
      dataSources.searchAPI.search(query, cursor),
    wordOfTheDay: (_, {}, { dataSources }) =>
      dataSources.databaseAPI.fetchWordoftheDay(),
    stems: (_, { term }, { dataSources }) =>
      dataSources.conjugationAPI.fetchStems(term),
    entrySuggestions: (_, {}, { dataSources }) =>
      dataSources.databaseAPI.fetchEntrySuggestions(),
    entrySuggestion: (_, { id }, { dataSources }) =>
      dataSources.databaseAPI.fetchEntrySuggestion(id),
  },
  Mutation: {
    createEntrySuggestion: (_, { suggestion }, { dataSources }) =>
      dataSources.databaseAPI.createEntrySuggestion(suggestion),
    applyEntrySuggestion: (_, { id }, { dataSources }) =>
      dataSources.databaseAPI.applyEntrySuggestion(id),
    editEntrySuggestion: (_, { id, suggestion }, { dataSources }) =>
      dataSources.databaseAPI.editEntrySuggestion(id, suggestion),
    deleteEntrySuggestion: (_, { id, suggestion }, { dataSources }) =>
      dataSources.databaseAPI.deleteEntrySuggestion(id, suggestion),
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
    NONE: 'none',
  },
};
