import { globalCollection, wordsCollection } from 'datasources/databaseWrapper';
import { entryReducer } from 'features/utils';
import { Resolvers } from 'generated/graphql';
import { ObjectId } from 'mongodb';

const resolvers: Resolvers = {
  Query: {
    wordOfTheDay: async () => {
      const wodDoc = await globalCollection().findOne({
        _id: 'wod' as unknown as ObjectId,
      });
      const wodEntry = await wordsCollection().findOne({ _id: wodDoc.entryID });
      return entryReducer(wodEntry);
    },
  },
};

export default resolvers;
