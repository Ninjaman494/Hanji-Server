export default {
  Query: {
    examples: (_, { id }, { dataSources }) =>
      dataSources.databaseAPI.fetchExamples(id),
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
    sendBugReport: (
      _,
      { feedback, email, type, deviceInfo, image },
      { dataSources },
    ) =>
      dataSources.slackAPI.sendBugReport(
        feedback,
        type,
        deviceInfo,
        email,
        image,
      ),
    createSurveySubmission: (_, { submission }, { dataSources }) =>
      dataSources.databaseAPI.createSurveySubmission(submission),
  },
};
