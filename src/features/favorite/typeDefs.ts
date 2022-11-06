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
    name: String # Unused, but have to keep b/c in old schema
    conjugationName: String!
    honorific: Boolean!
  }
`;

export default typeDef;
