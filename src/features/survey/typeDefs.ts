import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Mutation {
    createSurveySubmission(submission: [Question]!): BugReportResponse!
  }

  input Question {
    question: String!
    response: String
  }
`;

export default typeDef;
