import { EntryDoc } from 'datasources/database';
import { wordsCollection } from 'datasources/databaseWrapper';
import { getSafeID } from 'features/utils';
import { Entry, Resolvers } from 'generated/graphql';

const entryReducer = ({ _id, ...rest }: EntryDoc): Entry => ({
  id: _id.toString(),
  ...rest,
});

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
