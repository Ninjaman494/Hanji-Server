import { CONJUGATIONS } from './conjugationsSnapshot';
import conjugator from 'korean/conjugator';
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
  });

  it('resolves conjugationTypes queries', () => {
    const response = (resolvers.Query.conjugationTypes as any)();
    expect(response).toEqual(Array.from(conjugator.getTypes()));
  });

  it('resolves conjugationNames queries', () => {
    const response = (resolvers.Query.conjugationNames as any)();
    expect(response).toEqual(Array.from(conjugator.getNames()));
  });

  it('resolves stems queries', () => {
    const infinitive = (resolvers.Query.stems as any)(null, {
      term: '들다',
    });
    expect(infinitive).toEqual(['들다']);

    const multipleStems = (resolvers.Query.stems as any)(null, {
      term: '갈 거예요',
    });
    expect(multipleStems).toEqual(['갈다', '갛다', '가다']);
  });
});
