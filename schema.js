const { gql } = require('apollo-server');
const typeDefs = gql`
    type Query {
        entries(term: String!): [Entry]!
        entry(id: ID!): Entry
        examples(id: ID!): [Example]!
    }
    
    type Entry {
        id: ID!
        term: String!
        pos: String!
        definitions: [String]!
        antonyms: [String]
        synonyms: [String]
    }
    
    type Example {
        id: ID!,
        sentence: String!
        translation: String!
    }
`;

module.exports = typeDefs;