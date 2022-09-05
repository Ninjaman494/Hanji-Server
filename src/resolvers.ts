export default {
  Mutation: {
    createSurveySubmission: (_, { submission }, { dataSources }) =>
      dataSources.databaseAPI.createSurveySubmission(submission),
  },
};
