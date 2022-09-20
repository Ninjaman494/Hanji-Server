import { gql } from 'apollo-server';

// Entry suggestions has been deprecated. The endpoints here
// are only used internally and will be removed.
// Examples endpoint will be removed. Affects 0.54% total users
//   - Never used in RN
//   - Removed from Android in 2.0.9, PR #53, Mar. 28th 2021.
const typeDefs = gql`
  type Query @rateLimit(limit: 5, duration: 10) {
    examples(id: ID!): [Example]!
    entrySuggestions: [EntrySuggestion]!
    entrySuggestion(id: ID!): EntrySuggestion!
  }

  type Mutation @rateLimit(limit: 5, duration: 10) {
    editEntrySuggestion(
      id: ID!
      suggestion: EntrySuggestionInput!
    ): EntrySuggestionResponse!
    applyEntrySuggestion(id: ID!): EntrySuggestionResponse!
    deleteEntrySuggestion(id: ID!): EntrySuggestionResponse!
  }
`;

export default typeDefs;
