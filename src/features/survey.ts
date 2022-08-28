import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Mutation {
    createSurveySubmission(submission: [Question]!): BugReportResponse!
  }

  input Question {
    question: String!
    response: String
  }
`;

export const resolvers = {
  Mutation: {
    createSurveySubmission: () => {},
  },
};
