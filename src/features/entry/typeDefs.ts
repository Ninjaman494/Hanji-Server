import { gql } from 'apollo-server';

const typeDef = gql`
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

  type Example {
    sentence: String!
    translation: String!
  }
`;

export default typeDef;
