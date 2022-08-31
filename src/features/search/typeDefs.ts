import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    search(query: String!, cursor: Int): Result!
  }

  type Result {
    cursor: String
    results: [Entry]!
  }
`;

export default typeDef;
