import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import {
  Conjugation,
  conjugationResolvers,
  favoriteResolvers,
  Favorite,
  General,
} from 'features';
import { executeOperation } from 'tests/utils';

const EXPECTED_FAVS = [
  {
    name: 'connective if',
    conjugation: '가면',
    type: 'connective',
    tense: 'NONE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '가면',
    romanization: 'gah-myuhn',
    reasons: ['join (가 + 면 -> 가면)'],
  },
  {
    name: 'declarative present informal low',
    conjugation: '가셔',
    type: 'declarative present',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: true,
    pronunciation: '가셔',
    romanization: 'gah-syuh',
    reasons: [
      'join (가 + 시 -> 가시)',
      'vowel contraction [ㅣ ㅓ -> ㅕ] (가시 + 어 -> 가셔)',
    ],
  },
  {
    name: 'propositive informal low',
    conjugation: '가',
    type: 'propositive',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
];

// Need conjugation resolvers for enum mapping
const server = new ApolloServer({
  typeDefs: [General, Conjugation, Favorite],
  resolvers: { ...conjugationResolvers, ...favoriteResolvers },
});

describe('favorite feature', () => {
  it('handles favorites query', async () => {
    const query = gql`
      query Favorites(
        $stem: String!
        $isAdj: Boolean!
        $regular: Boolean
        $favorites: [FavInput]!
      ) {
        favorites(
          stem: $stem
          isAdj: $isAdj
          regular: $regular
          favorites: $favorites
        ) {
          name
          conjugation
          type
          tense
          speechLevel
          honorific
          pronunciation
          romanization
          reasons
        }
      }
    `;

    const { errors, data } = await executeOperation(server, query, {
      stem: '가다',
      isAdj: false,
      honorific: false,
      favorites: [
        {
          name: 'fav1',
          conjugationName: 'connective if',
          honorific: false,
        },
        {
          name: 'fav2',
          conjugationName: 'declarative present informal low',
          honorific: true,
        },
        {
          name: 'fav3',
          conjugationName: 'propositive informal low',
          honorific: false,
        },
      ],
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.favorites).toEqual(EXPECTED_FAVS);
  });
});
