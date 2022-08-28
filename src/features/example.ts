import { gql } from 'apollo-server';

export const typeDef = gql`
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

export const resolvers = {
  Query: {
    examples: () => {},
  },
};
