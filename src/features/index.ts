import gql from 'graphql-tag';
export {
  resolvers as bugReportResolvers,
  typeDefs as BugReport,
} from './bugReport';
export {
  resolvers as conjugationResolvers,
  typeDefs as Conjugation,
} from './conjugation';
export { resolvers as entryResolvers, typeDefs as Entry } from './entry';
export {
  resolvers as entrySuggestionResolvers,
  typeDefs as EntrySuggestion,
} from './entrySuggestion';
export {
  resolvers as favoriteResolvers,
  typeDefs as Favorite,
} from './favorite';
export { resolvers as searchResolvers, typeDefs as Search } from './search';
export { resolvers as surveyResolvers, typeDefs as Survey } from './survey';
export { resolvers as wodResolvers, typeDefs as WOD } from './wod';

export const General = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;
