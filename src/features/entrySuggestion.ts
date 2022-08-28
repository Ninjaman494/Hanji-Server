import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    entrySuggestions: [EntrySuggestion]!
    entrySuggestion(id: ID!): EntrySuggestion!
  }

  extend type Mutation {
    createEntrySuggestion(
      suggestion: EntrySuggestionInput!
    ): EntrySuggestionResponse!
    editEntrySuggestion(
      id: ID!
      suggestion: EntrySuggestionInput!
    ): EntrySuggestionResponse!
    applyEntrySuggestion(id: ID!): EntrySuggestionResponse!
    deleteEntrySuggestion(id: ID!): EntrySuggestionResponse!
  }

  type EntrySuggestion {
    id: ID!
    entryID: ID!
    antonyms: [String]
    synonyms: [String]
    examples: [Example]
    applied: Boolean!
  }

  type EntrySuggestionResponse {
    success: Boolean!
    message: String!
    entry: Entry
    suggestion: EntrySuggestion
  }

  input EntrySuggestionInput {
    entryID: ID!
    antonyms: [String]
    synonyms: [String]
    examples: [ExampleInput]
  }
`;

export const resolvers = {
  Query: {
    entrySuggestions: () => {},
    entrySuggestion: () => {},
  },
  Mutation: {
    createEntrySuggestion: () => {},
    editEntrySuggestion: () => {},
    applyEntrySuggestion: () => {},
    deleteEntrySuggestion: () => {},
  },
};
