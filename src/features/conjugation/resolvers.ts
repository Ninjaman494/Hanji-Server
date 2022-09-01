import { Conjugation, Resolvers, SpeechLevel, Tense } from 'generated/graphql';
import conjugator, { Conjugation as RawConjugation } from 'korean/conjugator';
import * as stemmer from 'korean/stemmer';

const conjugationReducer = (conjugation: RawConjugation): Conjugation => {
  const {
    conjugation_name,
    conjugated,
    romanized,
    tense,
    speechLevel,
    ...rest
  } = conjugation;

  return {
    name: conjugation_name,
    conjugation: conjugated,
    romanization: romanized,
    tense: tense as Tense,
    speechLevel: speechLevel as SpeechLevel,
    ...rest,
  };
};

const resolvers: Resolvers = {
  Query: {
    conjugations: (_, { stem, isAdj, honorific, regular, conjugations }) => {
      if (regular === null || regular === undefined) {
        // returns either 'regular verb' or type of irregular
        regular = conjugator.verb_type(stem, false) === 'regular verb';
      }

      const conjNames = conjugations?.map((name) => name.toLowerCase());

      const data: Conjugation[] = [];
      conjugator.conjugate(stem, regular, isAdj, honorific, (conjugations) => {
        conjugations.forEach((c) => {
          const conjugation = conjugationReducer(c);
          // If a list of conjugations was provided, check if this conjugation is part of the list
          if (conjNames != null && conjNames.includes(conjugation.name)) {
            data.push(conjugation);
          } else if (conjNames == null) {
            // No list was provided, add all conjugations
            data.push(conjugation);
          }
        });
      });
      return data;
    },
    conjugationTypes: () => Array.from(conjugator.getTypes()),
    conjugationNames: () => Array.from(conjugator.getNames()),
    stems: (_, { term }) => {
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
