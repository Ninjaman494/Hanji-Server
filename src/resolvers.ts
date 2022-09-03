export default {
  Query: {
    favorites: (_, { stem, isAdj, regular, favorites }, { dataSources }) =>
      dataSources.conjugationAPI.fetchFavorites(
        stem,
        isAdj,
        regular,
        favorites,
      ),
    search: (_, { query, cursor }, { dataSources }) =>
      dataSources.searchAPI.search(query, cursor),
    wordOfTheDay: (_, {}, { dataSources }) =>
      dataSources.databaseAPI.fetchWordoftheDay(),
  },
  Mutation: {
    createEntrySuggestion: (_, { suggestion }, { dataSources }) =>
      dataSources.databaseAPI.createEntrySuggestion(suggestion),
    createSurveySubmission: (_, { submission }, { dataSources }) =>
      dataSources.databaseAPI.createSurveySubmission(submission),
  },
};
