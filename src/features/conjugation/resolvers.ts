import { Resolvers } from 'generated/graphql';
import conjugator from 'korean/conjugator';

const resolvers: Resolvers = {
  Query: {
    conjugations: () => [],
    conjugationTypes: () => Array.from(conjugator.getTypes()),
    conjugationNames: () => [],
    stems: () => [],
  },
};

export default resolvers;
