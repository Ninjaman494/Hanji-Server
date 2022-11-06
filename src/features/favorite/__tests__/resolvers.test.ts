import resolvers from '../resolvers';

const FAVORITES = [
  {
    name: 'connective if',
    conjugation: '가면',
    romanization: 'gah-myuhn',
    tense: 'none',
    speechLevel: 'none',
    pronunciation: '가면',
    reasons: ['join (가 + 면 -> 가면)'],
    type: 'connective',
    honorific: false,
  },
  {
    name: 'declarative present informal low',
    conjugation: '가셔',
    romanization: 'gah-syuh',
    tense: 'present',
    speechLevel: 'informal low',
    pronunciation: '가셔',
    reasons: [
      'join (가 + 시 -> 가시)',
      'vowel contraction [ㅣ ㅓ -> ㅕ] (가시 + 어 -> 가셔)',
    ],
    type: 'declarative present',
    honorific: true,
  },
  {
    name: 'propositive informal low',
    conjugation: '가',
    romanization: 'gah',
    tense: 'present',
    speechLevel: 'informal low',
    pronunciation: '가',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
    type: 'propositive',
    honorific: false,
  },
];

describe('favorites resolver', () => {
  it('resolves favorites queries', () => {
    const conjugations = (resolvers.Query.favorites as any)(null, {
      stem: '가다',
      isAdj: false,
      favorites: [
        { conjugationName: FAVORITES[0].name, honorific: false },
        { conjugationName: FAVORITES[1].name, honorific: true },
        { conjugationName: FAVORITES[2].name, honorific: false },
      ],
    });

    expect(conjugations).toEqual(FAVORITES);
  });

  it('returns an empty array when no conjugations are found', () => {
    const conjugations = (resolvers.Query.favorites as any)(null, {
      stem: '가다',
      isAdj: false,
      favorites: [{ conjugationName: 'foobar', honorific: false }],
    });

    expect(conjugations.length).toEqual(0);
  });

  it('omits conjugations that cannnot be found', () => {
    const conjugations = (resolvers.Query.favorites as any)(null, {
      stem: '가다',
      isAdj: false,
      favorites: [
        { conjugationName: 'foobar', honorific: false },
        { conjugationName: FAVORITES[0].name, honorific: false },
        { conjugationName: FAVORITES[1].name, honorific: true },
      ],
    });

    expect(conjugations).toEqual(FAVORITES.slice(0, 2));
  });
});
