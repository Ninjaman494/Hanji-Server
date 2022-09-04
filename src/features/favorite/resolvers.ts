import { conjugationReducer } from 'features/utils';
import { Conjugation, Resolvers, FavInput } from 'generated/graphql';
import conjugator from 'korean/conjugator';

export const getConjugations = (
  stem: string,
  isAdj: boolean,
  regular: boolean,
  conjugations: FavInput[],
) => {
  if (regular === null || regular === undefined) {
    // returns either 'regular verb' or type of irregular
    regular = conjugator.verb_type(stem, false) === 'regular verb';
  }

  const data: Conjugation[] = conjugations.reduce((prev, curr) => {
    const conjugation = conjugator.conjugate_one(
      stem,
      regular,
      isAdj,
      curr.honorific,
      curr.conjugationName,
    );
    return conjugation ? [...prev, conjugationReducer(conjugation)] : prev;
  }, []);

  return data;
};

const resolvers: Resolvers = {
  Query: {
    favorites: (_, { stem, isAdj, regular, favorites }) =>
      getConjugations(stem, isAdj, regular, favorites),
  },
};

export default resolvers;
