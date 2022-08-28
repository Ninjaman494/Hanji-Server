import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    entries(term: String!): [Entry]!
    entry(id: ID!): Entry
  }

  type Entry {
    id: ID!
    term: String!
    pos: String!
    definitions: [String]!
    antonyms: [String]
    synonyms: [String]
    examples: [Example]
    regular: Boolean
    note: String
  }
`;

export const resolvers = {
  Query: {
    entries: () => {},
    entry: () => {},
  },
  Entry: {
    examples: () => {},
  },
};
