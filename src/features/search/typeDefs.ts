import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    search(query: String!, cursor: Int): Result!
  }

  type Result {
    cursor: Int
    results: [Entry]!
  }
`;

export default typeDef;
