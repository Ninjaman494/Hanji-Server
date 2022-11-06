import { gql } from 'apollo-server';

/**
 * This feature is deprecated. We're only
 * supporting createEntrySuggestions
 * because it's used in older versions of
 * the app
 */
const typeDef = gql`
  extend type Mutation {
    createEntrySuggestion(
      suggestion: EntrySuggestionInput!
    ): EntrySuggestionResponse!
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

  input ExampleInput {
    sentence: String!
    translation: String!
  }
`;

export default typeDef;
