import {
  CONJUGATIONS,
  CONJUGATION_NAMES,
  CONJUGATION_TYPES,
  SPECIFIC_CONJUGATIONS,
  STEMS,
} from './conjugationsSnapshot';
import resolvers from '../resolvers';

describe('conjugation resolver', () => {
  describe('conjugations query', () => {
    it('fetches conjugations', () => {
      const response = (resolvers.Query.conjugations as any)(null, {
        stem: '가다',
        isAdj: false,
        honorific: false,
        regular: true,
      });
      expect(response).toEqual(CONJUGATIONS);
    });

    it('fetches specific conjugations', () => {
      const conjugations = [
        'connective if',
        'declarative present informal low',
        'propositive informal low',
      ];
      const expectedConjugations = CONJUGATIONS.reduce(
        (prev, val) =>
          conjugations.includes(val.name) ? [...prev, val] : prev,
        [],
      );

      const response = (resolvers.Query.conjugations as any)(null, {
        stem: '가다',
        isAdj: false,
        honorific: false,
        regular: true,
        conjugations,
      });
      expect(response).toEqual(expectedConjugations);
    });

    it('returns no results when stem is empty', () => {
      const response = (resolvers.Query.conjugations as any)(null, {
        stem: '  ',
        isAdj: false,
        honorific: false,
        regular: true,
      });

      expect(response.length).toEqual(0);
    });
  });

  describe('getConjugations query', () => {
    it('fetches conjugations', () => {
      const response = (resolvers.Query.getConjugations as any)(null, {
        input: {
          stem: '가다',
          isAdj: false,
          honorific: false,
          regular: true,
        },
      });
      expect(response).toEqual(CONJUGATIONS);
    });

    it('fetches specific conjugations', () => {
      const conjugations = [
        { name: 'connective if', honorific: false },
        { name: 'declarative present informal high', honorific: true },
        { name: 'propositive informal low', honorific: false },
      ];

      const response = (resolvers.Query.getConjugations as any)(null, {
        input: {
          stem: '가다',
          isAdj: false,
          conjugations,
        },
      });
      expect(response).toEqual(SPECIFIC_CONJUGATIONS);
    });
  });

  it('resolves conjugationTypes queries', () => {
    const response = (resolvers.Query.conjugationTypes as any)();
    expect(response).toEqual(CONJUGATION_TYPES);
  });

  it('resolves conjugationNames queries', () => {
    const response = (resolvers.Query.conjugationNames as any)();
    expect(response).toEqual(CONJUGATION_NAMES);
  });

  describe('stems query', () => {
    it('resolves stems queries', () => {
      const infinitive = (resolvers.Query.stems as any)(null, {
        term: '들다',
      });
      expect(infinitive).toEqual(['들다']);

      const multipleStems = (resolvers.Query.stems as any)(null, {
        term: '갈 거예요',
      });
      expect(multipleStems).toEqual(STEMS);
    });

    it('returns no results when term is empty', () => {
      const response = (resolvers.Query.stems as any)(null, {
        term: '  ',
      });

      expect(response.length).toEqual(0);
    });
  });
});
