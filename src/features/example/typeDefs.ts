import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    examples(id: ID!): [Example]!
  }

  type Example {
    sentence: String!
    translation: String!
  }

  input ExampleInput {
    sentence: String!
    translation: String!
  }
`;

export default typeDef;
