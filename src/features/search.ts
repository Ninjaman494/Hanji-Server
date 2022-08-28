import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    search(query: String!, cursor: Int): Result!
  }

  type Result {
    cursor: String
    results: [Entry]!
  }
`;

export const resolvers = {
  Query: {
    search: () => {},
  },
};
