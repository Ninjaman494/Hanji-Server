import { wordsCollection } from 'datasources/databaseWrapper';
import { entryReducer, getSafeID } from 'features/utils';
import { Resolvers } from 'generated/graphql';

const resolvers: Resolvers = {
  Query: {
    entries: async (_, { term }) => {
      const results = await wordsCollection().find({ term }).toArray();
      return results.map(entryReducer);
    },
    entry: async (_, { id }) => {
      const _id = getSafeID(id);
      const results = await wordsCollection().find({ _id }).toArray();
      return !!results ? entryReducer(results[0]) : null;
    },
  },
};

export default resolvers;
