import { wordsCollection } from 'datasources/databaseWrapper';
import { entryReducer } from 'features/utils';
import { Entry, Resolvers } from 'generated/graphql';
import { is_hangeul_string } from 'korean/hangeul';
import { stem } from 'korean/stemmer';

const resolvers: Resolvers = {
  Query: {
    search: async (_, { query, cursor }) => {
      query = query.trim();

      if (!cursor || cursor < 0) cursor = 0;
      if (!query) return { cursor, results: [] };

      let results: Entry[];
      if (is_hangeul_string(query)) {
        // Korean search
        const stems = stem(query).add(query); // in case query is already in infinitive form
        const entriesMap = await Promise.all(
          Array.from(stems).map((stem) =>
            wordsCollection().find({ term: stem }).map(entryReducer).toArray(),
          ),
        );

        results = entriesMap
          .reduce((prev, curr) => prev.concat(curr))
          .slice(cursor);
      } else {
        // English search
        results = await wordsCollection()
          .find({ $text: { $search: query } }, { limit: 20, skip: cursor })
          .project({ score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .map(entryReducer)
          .toArray();
      }
      cursor = results.length === 0 ? -1 : cursor + results.length;

      return { cursor, results };
    },
  },
};

export default resolvers;
