import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    favorites(
      stem: String!
      isAdj: Boolean!
      regular: Boolean
      favorites: [FavInput]!
    ): [Conjugation]!
  }

  input FavInput {
    name: String!
    conjugationName: String!
    honorific: Boolean!
  }
`;

export default typeDef;
