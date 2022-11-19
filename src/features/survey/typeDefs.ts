import gql from 'graphql-tag';

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
