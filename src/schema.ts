import { gql } from 'apollo-server';
const typeDefs = gql`
  type Query @rateLimit(limit: 5, duration: 10) {
    entries(term: String!): [Entry]!
    entry(id: ID!): Entry
    examples(id: ID!): [Example]!
    conjugations(
      stem: String!
      isAdj: Boolean!
      honorific: Boolean!
      regular: Boolean
      conjugations: [String]
    ): [Conjugation]!
    favorites(
      stem: String!
      isAdj: Boolean!
      regular: Boolean
      favorites: [FavInput]!
    ): [Conjugation]!
    conjugationTypes: [String]!
    conjugationNames: [String]!
    search(query: String!, cursor: Int): Result!
    wordOfTheDay: Entry!
    stems(term: String!): [String]!
    entrySuggestions: [EntrySuggestion]!
    entrySuggestion(id: ID!): EntrySuggestion!
  }

  type Mutation @rateLimit(limit: 5, duration: 10) {
    createEntrySuggestion(
      suggestion: EntrySuggestionInput!
    ): EntrySuggestionResponse!
    editEntrySuggestion(
      id: ID!
      suggestion: EntrySuggestionInput!
    ): EntrySuggestionResponse!
    applyEntrySuggestion(id: ID!): EntrySuggestionResponse!
    deleteEntrySuggestion(id: ID!): EntrySuggestionResponse!
    sendBugReport(
      feedback: String!
      type: BugReportType!
      deviceInfo: DeviceInfo!
      email: String
      image: Upload
    ): BugReportResponse!
  }

  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map
  scalar Upload

  type Result {
    cursor: String
    results: [Entry]!
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

  enum Tense {
    PRESENT
    PAST
    FUTURE
    NONE
  }

  enum SpeechLevel {
    FORMAL_LOW
    INFORMAL_LOW
    INFORMAL_HIGH
    FORMAL_HIGH
    NONE
  }

  enum BugReportType {
    BUG
    NEW_FEATURE
    OTHER
  }

  type Conjugation {
    name: String!
    conjugation: String!
    type: String!
    tense: Tense!
    speechLevel: SpeechLevel!
    honorific: Boolean!
    pronunciation: String!
    romanization: String!
    reasons: [String]!
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

  type BugReportResponse {
    success: Boolean!
    message: String!
  }

  input FavInput {
    name: String!
    conjugationName: String!
    honorific: Boolean!
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

  input DeviceInfo {
    version: String!
    brand: String!
    manufacturer: String!
    model: String!
    sdkVersion: String!
  }
`;

export default typeDefs;
