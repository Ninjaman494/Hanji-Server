const { gql } = require('apollo-server');
const typeDefs = gql`
    type Query {
        entries(term: String!): [Entry]!
        entry(id: ID!): Entry
        examples(id: ID!): [Example]!
        conjugations(stem: String!, isAdj: Boolean!, honorific: Boolean!, regular: Boolean, conjugations: [String]): [Conjugation]!
        favorites(stem: String!, isAdj: Boolean!, regular: Boolean, favorites: [FavInput]!): [Conjugation]!
        conjugationTypes: [String]!
        conjugationNames: [String]!
        search(query: String!, cursor: Int): Result!
        wordOfTheDay: Entry!
        stems(term: String!): [String]!
        entrySuggestions: [EntrySuggestion]!
        entrySuggestion(id: ID!): EntrySuggestion!
    }
    
    type Mutation {
        createEntrySuggestion(suggestion: EntrySuggestionInput!): EntrySuggestionResponse!
        editEntrySuggestion(id: ID!, suggestion: EntrySuggestionInput!): EntrySuggestionResponse!
        applyEntrySuggestion(id: ID!): EntrySuggestionResponse!
    }
    
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
        PRESENT,
        PAST,
        FUTURE,
        NONE
    }
    
    enum SpeechLevel {
        FORMAL_LOW,
        INFORMAL_LOW,
        INFORMAL_HIGH,
        FORMAL_HIGH,
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
`;

module.exports = typeDefs;