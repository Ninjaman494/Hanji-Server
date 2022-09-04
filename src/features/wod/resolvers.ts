import { EntryDoc } from 'datasources/database';
import { wordsCollection } from 'datasources/databaseWrapper';
import { entryReducer } from 'features/utils';
import { Resolvers } from 'generated/graphql';

let lastWOD = null;
let lastFetched = new Date();

const resolvers: Resolvers = {
  Query: {
    wordOfTheDay: async () => {
      const hourDiff =
        Math.abs(new Date().getTime() - lastFetched.getTime()) / 36e5;

      if (lastWOD == null || hourDiff >= 24) {
        // fetch new Word of the Day
        const result = await wordsCollection()
          .aggregate<EntryDoc>([{ $sample: { size: 1 } }])
          .toArray();
        lastWOD = result[0];
        lastFetched = new Date();
      }

      return entryReducer(lastWOD);
    },
  },
};

export default resolvers;
