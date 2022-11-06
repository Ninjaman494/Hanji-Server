import * as databaseWrapper from 'datasources/databaseWrapper';
import { ObjectId } from 'mongodb';
import resolvers from '../resolvers';

const entry = {
  _id: new ObjectId(),
  term: '사과',
  pos: 'Noun',
  definitions: ['apple'],
};

const suggestion = {
  entryID: entry._id,
  antonyms: ['antonym'],
  synonyms: ['synonym'],
};

const insertOne = jest.fn();
jest
  .spyOn(databaseWrapper, 'wordsCollection')
  .mockReturnValue({ find: () => ({ toArray: () => [entry] }) } as any);
jest
  .spyOn(databaseWrapper, 'entrySuggestionsCollection')
  .mockReturnValue({ insertOne } as any);

describe('entrySuggestion resolvers', () => {
  it('resolves createEntrySuggestion mutation', async () => {
    insertOne.mockReturnValue({ insertedId: '1' });

    const { success, message } = await (
      resolvers.Mutation.createEntrySuggestion as any
    )(null, { suggestion });

    expect(insertOne).toHaveBeenCalledWith({
      ...suggestion,
      examples: undefined,
    });
    expect(success).toBeTruthy();
    expect(message).toEqual('Entry suggestion successfully created');
  });

  it('handles errors', async () => {
    insertOne.mockReturnValue({ insertedId: null });

    const { success, message } = await (
      resolvers.Mutation.createEntrySuggestion as any
    )(null, { suggestion });

    expect(insertOne).toHaveBeenCalledWith({
      ...suggestion,
      examples: undefined,
    });
    expect(success).toBeFalsy();
    expect(message).toEqual('Failed to insert suggestion into database');
  });

  it('removes invalid suggestions', async () => {
    insertOne.mockReturnValue({ insertedId: '1' });

    const { success, message } = await (
      resolvers.Mutation.createEntrySuggestion as any
    )(null, {
      suggestion: {
        entryID: entry._id,
        antonyms: ['', 'antonym'],
        synonyms: ['', 'bar', '', 'foo'],
        examples: [
          { sentence: '', translation: 'translation' },
          { sentence: 'sentence', translation: '' },
          { sentence: 'sentence', translation: 'translation' },
        ],
      },
    });

    expect(insertOne).toHaveBeenCalledWith({
      entryID: entry._id,
      antonyms: ['antonym'],
      synonyms: ['bar', 'foo'],
      examples: [{ sentence: 'sentence', translation: 'translation' }],
    });
    expect(success).toBeTruthy();
    expect(message).toEqual('Entry suggestion successfully created');
  });
});
