import { GraphQLUpload } from 'graphql-upload';

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    sendBugReport: () => {},
  },
};

export default resolvers;
