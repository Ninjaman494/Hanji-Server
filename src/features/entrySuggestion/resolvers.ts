import {
  entrySuggestionsCollection,
  wordsCollection,
} from 'datasources/databaseWrapper';
import { getSafeID } from 'features/utils';
import { Resolvers } from 'generated/graphql';

const resolvers: Resolvers = {
  Mutation: {
    createEntrySuggestion: async (_, { suggestion }) => {
      const { entryID, antonyms, synonyms, examples } = suggestion;

      const _id = getSafeID(entryID);
      const entries = await wordsCollection().find({ _id }).toArray();
      if (!entries.length) {
        return {
          success: false,
          message: "An entry with the given id doesn't exist",
        };
      }

      const { insertedId } = await entrySuggestionsCollection().insertOne({
        entryID: _id,
        antonyms: antonyms?.filter((a) => a.length > 0),
        synonyms: synonyms?.filter((s) => s.length > 0),
        examples: examples?.filter(
          (e) => e.sentence.length > 0 && e.translation.length > 0,
        ),
      });

      return {
        success: !!insertedId,
        message: !!insertedId
          ? 'Entry suggestion successfully created'
          : 'Failed to insert suggestion into database',
      };
    },
  },
};

export default resolvers;
