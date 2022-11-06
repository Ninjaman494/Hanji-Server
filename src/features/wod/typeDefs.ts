import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    wordOfTheDay: Entry!
  }
`;

export default typeDef;
