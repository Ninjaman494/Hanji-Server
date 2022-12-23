import { globalCollection, wordsCollection } from 'datasources/databaseWrapper';
import { entryReducer } from 'features/utils';
import { Resolvers } from 'generated/graphql';

const resolvers: Resolvers = {
  Query: {
    wordOfTheDay: async () => {
      const wodDoc = await globalCollection().findOne({ _id: 'wod' });
      const wodEntry = await wordsCollection().findOne({ _id: wodDoc.entryID });
      return entryReducer(wodEntry);
    },
  },
};

export default resolvers;
