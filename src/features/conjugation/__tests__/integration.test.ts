import { ApolloServer } from '@apollo/server';
import gql from 'graphql-tag';
import { Conjugation, General } from 'features';
import resolvers from '../resolvers';
import {
  CONJUGATIONS_INTEGRATION,
  CONJUGATION_NAMES,
  CONJUGATION_TYPES,
  SPECIFIC_CONJUGATIONS_INTEGRATION,
  STEMS,
} from './conjugationsSnapshot';
import { executeOperation } from 'tests/utils';

const server = new ApolloServer({
  typeDefs: [General, Conjugation],
  resolvers,
});

describe('conjugation feature', () => {
  describe('getConjugations query', () => {
    it('fetches conjugations', async () => {
      const query = gql`
        query GetConjugations($input: ConjugationsInput!) {
          getConjugations(input: $input) {
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
        input: {
          stem: '가다',
          isAdj: false,
          honorific: false,
        },
      });

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.getConjugations).toEqual(CONJUGATIONS_INTEGRATION);
    });

    it('fetches specific conjugations', async () => {
      const query = gql`
        query GetConjugations($input: ConjugationsInput!) {
          getConjugations(input: $input) {
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
        input: {
          stem: '가다',
          isAdj: false,
          honorific: false,
          conjugations: [
            { name: 'connective if', honorific: false },
            { name: 'declarative present informal high', honorific: true },
            { name: 'propositive informal low', honorific: false },
          ],
        },
      });

      expect(errors).toBeUndefined();
      expect(data).toBeDefined();
      expect(data.getConjugations).toEqual(SPECIFIC_CONJUGATIONS_INTEGRATION);
    });
  });

  it('handles conjugations queries', async () => {
    const query = gql`
      query Conjugations(
        $stem: String!
        $isAdj: Boolean!
        $honorific: Boolean!
        $regular: Boolean
        $conjugations: [String]
      ) {
        conjugations(
          stem: $stem
          isAdj: $isAdj
          honorific: $honorific
          regular: $regular
          conjugations: $conjugations
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
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.conjugations).toEqual(CONJUGATIONS_INTEGRATION);
  });

  it('handles conjugationTypes queries', async () => {
    const query = gql`
      query ConjugationTypes {
        conjugationTypes
      }
    `;

    const { errors, data } = await executeOperation(server, query);

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.conjugationTypes).toEqual(CONJUGATION_TYPES);
  });

  it('handles conjugationNames queries', async () => {
    const query = gql`
      query ConjugationNames {
        conjugationNames
      }
    `;

    const { errors, data } = await executeOperation(server, query);

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.conjugationNames).toEqual(CONJUGATION_NAMES);
  });

  it('handles stems queries', async () => {
    const query = gql`
      query Stems($term: String!) {
        stems(term: $term)
      }
    `;

    const { errors, data } = await executeOperation(server, query, {
      term: '갈 거예요',
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.stems).toEqual(STEMS);
  });
});
