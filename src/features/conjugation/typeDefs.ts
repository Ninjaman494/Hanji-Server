import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    conjugations(
      stem: String!
      isAdj: Boolean!
      honorific: Boolean!
      regular: Boolean
      conjugations: [String]
    ): [Conjugation]!
    conjugationTypes: [String]!
    conjugationNames: [String]!
    stems(term: String!): [String]!
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
`;

export default typeDef;
