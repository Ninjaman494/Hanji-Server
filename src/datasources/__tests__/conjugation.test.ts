import conjugator from '../../korean/conjugator';
import ConjugationAPI from '../conjugation';
import { CONJUGATIONS, FAVORITES } from './__mocks__/conjugationsSnapshot';

const datasource = new ConjugationAPI();

describe('ConjugationAPI datasource', () => {
  it('fetches conjugations', () => {
    const result = datasource.fetchConjugations('가다', false, false, true);
    expect(result).toEqual(CONJUGATIONS);
  });

  it('fetches specific conjugations', () => {
    const conjNames = [
      'connective if',
      'declarative present informal low',
      'propositive informal low',
    ];
    const conjugations = CONJUGATIONS.reduce(
      (prev, val) => (conjNames.includes(val.name) ? [...prev, val] : prev),
      [],
    );

    const result = datasource.fetchConjugations(
      '가다',
      false,
      false,
      true,
      conjNames,
    );

    expect(result).toEqual(conjugations);
  });

  it('fetches favorites', () => {
    const result = datasource.fetchFavorites('가다', false, false, [
      {
        name: 'favorite 1',
        conjugationName: 'connective if',
        honorific: false,
      },
      {
        name: 'favorite 2',
        conjugationName: 'declarative present informal low',
        honorific: true,
      },
      {
        name: 'favorite 3',
        conjugationName: 'propositive informal low',
        honorific: false,
      },
    ]);
    expect(result).toEqual(FAVORITES);
  });

  it('fetches conjugations types', () => {
    const result = datasource.fetchConjugationTypes();
    expect(result).toEqual([...conjugator.getTypes()]);
  });

  it('fetches conjugation names', () => {
    const result = datasource.fetchConjugationNames();
    expect(result).toEqual([...conjugator.getNames()]);
  });

  it('fetches stems', () => {
    const infinitive = datasource.fetchStems('듣다');
    expect(infinitive).toEqual(['듣다']);

    const future = datasource.fetchStems('갈 거예요');
    expect(future).toEqual(['갈다', '갛다', '가다']);
  });
});
