import { EntryDoc, Id } from 'datasources/database';
import { wordsCollection } from 'datasources/databaseWrapper';
import { Entry, Resolvers } from 'generated/graphql';
import { ObjectId } from 'mongodb';
import { is_hangeul } from 'korean/hangeul';

// Check if id is ObjectID or old form
const getSafeID = (id: Id): ObjectId => {
  const hasHangul = Array.from(id as string).some((char) => is_hangeul(char));
  return !hasHangul ? new ObjectId(id) : (id as ObjectId);
};

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
  // Entry: {
  //   examples: async () => {},
  // },
};

export default resolvers;
