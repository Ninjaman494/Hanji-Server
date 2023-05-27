import { wordsCollection } from 'datasources/databaseWrapper';
import { findCorrection, getVocab } from 'features/autocorrect/autocorrect';
import { breakDownWord } from 'features/autocorrect/utils';
import { entryReducer } from 'features/utils';
import { Entry, Resolvers } from 'generated/graphql';
import { is_hangeul_string } from 'korean/hangeul';
import { stem } from 'korean/stemmer';

const resolvers: Resolvers = {
  Query: {
    search: async (_, { query, cursor }) => {
      query = query.trim();
      let autocorrected = false;

      if (!cursor || cursor < 0) cursor = 0;
      if (!query) return { cursor, autocorrected, results: [] };

      let results: Entry[];
      if (is_hangeul_string(query)) {
        results = await searchKorean(query, cursor);

        // Do it all over again but with autocorrect
        if (!results.length) {
          const vocab = getVocab();
          const brokenDownQuery = breakDownWord(query);
          const autocorrect = findCorrection(brokenDownQuery, vocab);

          results = await searchKorean(autocorrect, cursor);
          autocorrected = true;
        }
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

      return { cursor, autocorrected, results };
    },
  },
};

const searchKorean = async (query: string, cursor?: number) => {
  const stems = stem(query).add(query); // in case query is already in infinitive form
  const entriesMap = await Promise.all(
    Array.from(stems).map((stem) =>
      wordsCollection().find({ term: stem }).map(entryReducer).toArray(),
    ),
  );

  return entriesMap.reduce((prev, curr) => prev.concat(curr)).slice(cursor);
};

export default resolvers;
