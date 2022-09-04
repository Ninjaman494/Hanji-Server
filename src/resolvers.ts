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
  },
  Mutation: {
    createSurveySubmission: (_, { submission }, { dataSources }) =>
      dataSources.databaseAPI.createSurveySubmission(submission),
  },
};
