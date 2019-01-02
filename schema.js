const { gql } = require('apollo-server');
const typeDefs = gql`
    type Query {
        entries(term: String!): [Entry]!
        entry(id: ID!): Entry
        examples(id: ID!): [Example]!
        conjugation(stem: String!, isAdj: Boolean!, regular: Boolean): [Conjugation]!
        search(query: String!): [Entry]!
    }
    
    type Entry {
        id: ID!
        term: String!
        pos: String!
        definitions: [String]!
        antonyms: [String]
        synonyms: [String]
        regular: Boolean
        note: String
    }
    
    type Example {
        id: ID!,
        sentence: String!
        translation: String!
    }
    
    enum Tense {
        PRESENT,
        PAST,
        FUTURE,
        NONE
    }
    
    enum SpeechLevel {
        FORMAL_NON_POLITE,
        INFORMAL_NON_POLITE,
        INFORMAL_POLITE,
        FORMAL_POLITE,
        NONE
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
`;

module.exports = typeDefs;