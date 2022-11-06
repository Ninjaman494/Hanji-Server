import { ApolloServer, gql } from 'apollo-server';
import { Conjugation, General } from 'features';
import resolvers from '../resolvers';
import {
  CONJUGATIONS_INTEGRATION,
  CONJUGATION_NAMES,
  CONJUGATION_TYPES,
  STEMS,
} from './conjugationsSnapshot';

const server = new ApolloServer({
  typeDefs: [General, Conjugation],
  resolvers,
});

describe('conjugation feature', () => {
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

    const { errors, data } = await server.executeOperation({
      query,
      variables: {
        stem: '가다',
        isAdj: false,
        honorific: false,
      },
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

    const { errors, data } = await server.executeOperation({ query });

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

    const { errors, data } = await server.executeOperation({ query });

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

    const { errors, data } = await server.executeOperation({
      query,
      variables: { term: '갈 거예요' },
    });

    expect(errors).toBeUndefined();
    expect(data).toBeDefined();
    expect(data.stems).toEqual(STEMS);
  });
});
