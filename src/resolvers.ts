export default {
  Query: {
    search: (_, { query, cursor }, { dataSources }) =>
      dataSources.searchAPI.search(query, cursor),
  },
  Mutation: {
    createSurveySubmission: (_, { submission }, { dataSources }) =>
      dataSources.databaseAPI.createSurveySubmission(submission),
  },
};
