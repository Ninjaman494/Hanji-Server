import * as databaseWrapper from 'datasources/databaseWrapper';
import { ObjectId } from 'mongodb';
import resolvers from '../resolvers';

const entry = {
  _id: new ObjectId(),
  term: '가다',
  pos: 'Verb',
  alwaysHonorific: false,
  definitions: ['to go'],
  antonyms: ['오다'],
  examples: [
    {
      sentence: 'I go',
      translation: '저는 가요',
    },
  ],
};

const findWord = jest.fn().mockReturnValue(entry);

jest.spyOn(databaseWrapper, 'globalCollection').mockReturnValue({
  findOne: () => ({ entryID: entry._id }),
} as any);
jest.spyOn(databaseWrapper, 'wordsCollection').mockReturnValue({
  findOne: findWord,
} as any);

jest.useFakeTimers().setSystemTime(1);

describe('WOD resolver', () => {
  it('resolves wordOfTheDay queries', async () => {
    const { _id, ...rest } = entry;

    const response = await (resolvers.Query.wordOfTheDay as any)();
    expect(databaseWrapper.globalCollection).toHaveBeenCalled();
    expect(findWord).toHaveBeenCalledWith({ _id });
    expect(response).toEqual({ id: _id.toString(), ...rest });
  });
});
