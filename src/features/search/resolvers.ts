import { wordsCollection } from 'datasources/databaseWrapper';
import { findCorrection } from 'features/autocorrect/autocorrect';
import { breakDownWord } from 'features/autocorrect/utils';
import { entryReducer } from 'features/utils';
import { Entry, Resolvers } from 'generated/graphql';
import { is_hangeul } from 'korean/hangeul';
import { stem } from 'korean/stemmer';

const resolvers: Resolvers = {
  Query: {
    search: async (_, { query, cursor }) => {
      query = query.trim();
      let autocorrected = false;

      if (!cursor || cursor < 0) cursor = 0;
      if (!query) return { cursor, autocorrected, results: [] };

      let results: Entry[];
      if (isKorean(query)) {
        results = await searchKorean(query);

        // Do it all over again but with autocorrect
        if (!results.length) {
          const brokenDownQuery = breakDownWord(query);
          const autocorrect = findCorrection(brokenDownQuery);

          results = await searchKorean(autocorrect);
          autocorrected = true;
        }

        results = results.slice(cursor);
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

const searchKorean = async (query: string) => {
  const stems = stem(query).add(query); // in case query is already in infinitive form
  const entriesMap = await Promise.all(
    Array.from(stems).map((stem) =>
      wordsCollection().find({ term: stem }).map(entryReducer).toArray(),
    ),
  );

  return entriesMap.reduce((prev, curr) => prev.concat(curr));
};

/** Similar to is_hangeul_string but also checks for jamo */
const isKorean = (query: string) =>
  query
    // remove spaces and punctuation
    .replace(/[!"\?\. ]/g, '')
    .split('')
    .every((c) => is_hangeul(c) || isJamo(c));

const isJamo = (word: string) =>
  (word.charCodeAt(0) >= 'ㄱ'.charCodeAt(0) &&
    word.charCodeAt(0) <= 'ㆎ'.charCodeAt(0)) ||
  (word.charCodeAt(0) >= 'ᄀ'.charCodeAt(0) &&
    word.charCodeAt(0) <= 'ᇿ'.charCodeAt(0));

export default resolvers;
