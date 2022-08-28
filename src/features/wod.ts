import { gql } from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    wordOfTheDay: Entry!
  }
`;

export const resolvers = {
  Query: {
    wordOfTheDay: () => {},
  },
};
