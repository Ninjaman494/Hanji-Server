import { getConjugations } from 'features/favorite/resolvers';
import { conjugationReducer } from 'features/utils';
import {
  Conjugation,
  FavInput,
  Resolvers,
  SpeechLevel,
  Tense,
} from 'generated/graphql';
import conjugator from 'korean/conjugator';
import * as stemmer from 'korean/stemmer';

const resolvers: Resolvers = {
  Query: {
    conjugations: (_, { stem, isAdj, honorific, regular, conjugations }) => {
      if (!stem.trim()) return [];

      // Use favorites' method to get specific conjugations because it's
      // more performant.
      // TODO - In the future favorites should be merged with conjugations
      if (!!conjugations) {
        const conjArgs: FavInput[] = conjugations.map((conjugationName) => ({
          conjugationName,
          honorific,
          regular,
        }));
        return getConjugations(stem, isAdj, regular, conjArgs);
      }

      if (regular === null || regular === undefined) {
        // returns either 'regular verb' or type of irregular
        regular = conjugator.verb_type(stem, false) === 'regular verb';
      }

      const data: Conjugation[] = [];
      conjugator.conjugate(stem, regular, isAdj, honorific, (conjugations) =>
        conjugations.forEach((c) => data.push(conjugationReducer(c))),
      );
      return data;
    },
    conjugationTypes: () => Array.from(conjugator.getTypes()),
    conjugationNames: () => Array.from(conjugator.getNames()),
    stems: (_, { term }) => {
      if (!term.trim()) return [];

      const stems = stemmer.stem(term);
      // in case term is already in infinitive form
      if (term[term.length - 1] === '다') stems.add(term);
      return Array.from(stems);
    },
  },
  Tense: {
    PRESENT: Tense.PRESENT,
    PAST: Tense.PAST,
    FUTURE: Tense.FUTURE,
    NONE: Tense.NONE,
  },
  SpeechLevel: {
    FORMAL_LOW: SpeechLevel.FORMAL_LOW,
    INFORMAL_LOW: SpeechLevel.INFORMAL_LOW,
    INFORMAL_HIGH: SpeechLevel.INFORMAL_HIGH,
    FORMAL_HIGH: SpeechLevel.FORMAL_HIGH,
    NONE: SpeechLevel.NONE,
  },
};

export default resolvers;
