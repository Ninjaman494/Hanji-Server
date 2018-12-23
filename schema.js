const { gql } = require('apollo-server');
const typeDefs = gql`
    type Query {
        entries(term: ID!): [Entry]!
        entry(id: String!): Entry
    }
    
    type Entry {
        id: ID!
        term: String!
        pos: String!
        definitions: [String]!
        examples: [Example]
        antonyms: [String]
        synonyms: [String]
    }
    
    type Example {
        example: String!
        translation: String!
    }
`;

module.exports = typeDefs;