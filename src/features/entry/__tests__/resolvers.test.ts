import * as databaseWrapper from 'datasources/databaseWrapper';
import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import resolvers from '../resolvers';

const entry = {
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

const find = jest.fn();
jest.spyOn(databaseWrapper, 'wordsCollection').mockReturnValue({ find } as any);

describe('entries resolver', () => {
  describe('entry query', () => {
    it('resolves entry queries', async () => {
      find.mockReturnValue({ toArray: () => [entry] });
      const response = await (resolvers.Query.entry as any)(null, {
        id: entry._id,
      });

      expect(find).toHaveBeenCalledWith({ _id: entry._id });
      expect(response).toEqual({
        id: entry._id.toString(),
        ...omit(entry, ['_id']),
      });
    });

    it('can handle no results', async () => {
      find.mockReturnValue({ toArray: () => [] });
      const response = await (resolvers.Query.entry as any)(null, {
        id: entry._id,
      });

      expect(find).toHaveBeenCalledWith({ _id: entry._id });
      expect(response).toBeNull();
    });
  });

  describe('entries query', () => {
    it('resolves entries queries', async () => {
      find.mockReturnValue({ toArray: () => [entry, entry] });
      const response = await (resolvers.Query.entries as any)(null, {
        term: entry.term,
      });

      const idFixedEntry = {
        id: entry._id.toString(),
        ...omit(entry, ['_id']),
      };
      expect(find).toHaveBeenCalledWith({ term: entry.term });
      expect(response).toEqual([idFixedEntry, idFixedEntry]);
    });

    it('can handle no results', async () => {
      find.mockReturnValue({ toArray: () => [] });
      const response = await (resolvers.Query.entries as any)(null, {
        term: entry.term,
      });

      expect(find).toHaveBeenCalledWith({ term: entry.term });
      expect(response).toEqual([]);
    });
  });
});
