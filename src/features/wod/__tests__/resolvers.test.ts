import * as databaseWrapper from 'datasources/databaseWrapper';
import { EntryDoc } from 'datasources/types';
import { ObjectId } from 'mongodb';
import resolvers from '../resolvers';

const verbEntry = {
  _id: new ObjectId(),
  term: '가다',
  pos: 'Verb',
  definitions: ['to go'],
  antonyms: ['오다'],
  examples: [
    {
      sentence: 'I go',
      translation: '저는 가요',
    },
  ],
};

const nounEntry = {
  _id: new ObjectId(),
  term: '사과',
  pos: 'Noun',
  definitions: ['apple'],
};

const mockDB = (entry: EntryDoc) => {
  jest.spyOn(databaseWrapper, 'wordsCollection').mockReturnValue({
    aggregate: () => ({ toArray: () => [entry] }),
  } as any);
};

jest.useFakeTimers().setSystemTime(1);

describe('WOD resolver', () => {
  // Ideally this test would be split into three, but because of how
  // lastFetched and last WOD behave, it all needs to be done in one test
  it('resolves wordOfTheDay queries', async () => {
    mockDB(verbEntry);
    const { _id, ...rest } = verbEntry;

    const response = await (resolvers.Query.wordOfTheDay as any)();
    expect(databaseWrapper.wordsCollection).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ id: _id.toString(), ...rest });

    // Call again to confirm we get the same response
    const response2 = await (resolvers.Query.wordOfTheDay as any)();
    expect(response2).toEqual(response);
    expect(databaseWrapper.wordsCollection).toHaveBeenCalledTimes(1);

    // Move forward 25 hours
    jest.setSystemTime(36e5 * 25);
    mockDB(nounEntry);

    const response3 = await (resolvers.Query.wordOfTheDay as any)();
    expect(response3).not.toEqual(response2);
    expect(databaseWrapper.wordsCollection).toHaveBeenCalledTimes(2);
  });
});
