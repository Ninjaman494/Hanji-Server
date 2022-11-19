import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    wordOfTheDay: Entry!
  }
`;

export default typeDef;
