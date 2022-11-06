import { surveySubmissionsCollection } from 'datasources/databaseWrapper';
import { Resolvers } from 'generated/graphql';

const resolvers: Resolvers = {
  Mutation: {
    createSurveySubmission: async (_, { submission }) => {
      const flattened = submission.reduce(
        (prev, { question, response }) => ({ ...prev, [question]: response }),
        {},
      );

      const { insertedId } = await surveySubmissionsCollection().insertOne(
        flattened,
      );

      return {
        success: !!insertedId,
        message: !!insertedId
          ? 'Submission successfully created'
          : 'Failed to add submission to database',
      };
    },
  },
};

export default resolvers;
