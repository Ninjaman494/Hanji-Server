jest.mock('features/autocorrect/autocorrect');

import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import { setupMockDB, teardownDB } from 'tests/utils';
import * as databaseWrapper from 'datasources/databaseWrapper';
import resolvers from '../resolvers';
import { findCorrection } from 'features/autocorrect/autocorrect';

const entries = [
  {
    _id: new ObjectId(),
    term: '김지',
    pos: 'Verb',
    definitions: ['kimchi'],
    alwaysHonorific: false,
  },
  {
    _id: new ObjectId(),
    term: '가다',
    pos: 'Verb',
    definitions: ['to go'],
    alwaysHonorific: false,
  },
  ...Array.from({ length: 20 }, () => ({
    _id: new ObjectId(),
    term: '오다',
    pos: 'Verb',
    definitions: ['to come and go'],
    alwaysHonorific: false,
  })),
];

describe('search resolver', () => {
  beforeAll(async () => await setupMockDB(entries));

  afterAll(teardownDB);

  it('returns no results when query is empty', async () => {
    const { results, cursor } = await (resolvers.Query.search as any)(null, {
      query: '  ',
    });

    expect(results.length).toEqual(0);
    expect(cursor).toEqual(0);
  });

  it('trims extra whitespace from queries', async () => {
    const { results, cursor } = await (resolvers.Query.search as any)(null, {
      query: '   김지   ',
    });

    const { _id, ...rest } = entries[0];
    expect(results.length).toEqual(1);
    expect(cursor).toEqual(1);
    expect(omit(results[0], ['score'])).toEqual({
      id: _id.toString(),
      ...rest,
    });
  });

  describe('English', () => {
    const toArray = jest.fn();
    const aggregate = jest.fn().mockReturnValue({ map: () => ({ toArray }) });
    const verifySearchQuery = (query: string, cursor = 0) => {
      expect(aggregate).toHaveBeenCalledWith([
        {
          $search: {
            index: 'default',
            text: { query, path: 'definitions' },
          },
        },
        { $skip: cursor },
        { $limit: 20 },
      ]);
    };

    beforeEach(() => {
      jest
        .spyOn(databaseWrapper, 'wordsCollection')
        .mockReturnValue({ aggregate } as any);
    });

    it('resolves search queries', async () => {
      const query = 'kimchi';
      toArray.mockReturnValueOnce([entries[0]]);

      const { results, cursor } = await (resolvers.Query.search as any)(null, {
        query,
      });

      verifySearchQuery(query);
      expect(results).toEqual([entries[0]]);
      expect(cursor).toEqual(1);
    });

    it('can paginate search results', async () => {
      const query = 'to go';

      // First page
      let mockedReturnValue = entries.slice(2);
      toArray.mockReturnValueOnce(mockedReturnValue);
      const { results, cursor } = await (resolvers.Query.search as any)(null, {
        query,
      });

      verifySearchQuery(query);
      expect(results).toEqual(mockedReturnValue);
      expect(cursor).toEqual(20);

      // Second page
      mockedReturnValue = entries.slice(21);
      toArray.mockReturnValueOnce(mockedReturnValue);
      const { results: paginatedResults, cursor: paginatedCursor } = await (
        resolvers.Query.search as any
      )(null, { query, cursor });

      verifySearchQuery(query, cursor);
      expect(paginatedResults).toEqual(mockedReturnValue);
      expect(paginatedCursor).toEqual(21);

      // Last page, should be empty
      mockedReturnValue = [];
      toArray.mockReturnValueOnce(mockedReturnValue);
      const { results: noResults, cursor: noCursor } = await (
        resolvers.Query.search as any
      )(null, { query, cursor: paginatedCursor });

      verifySearchQuery(query, paginatedCursor);
      expect(noResults).toEqual(mockedReturnValue);
      expect(noCursor).toEqual(-1);
    });
  });

  describe('Korean', () => {
    // Clear mocks used in English tests and go back to actual implementation
    beforeAll(jest.restoreAllMocks);

    it('resolves search queries', async () => {
      const { results, cursor } = await (resolvers.Query.search as any)(null, {
        query: '김지',
      });

      const { _id, ...rest } = entries[0];
      expect(results.length).toEqual(1);
      expect(cursor).toEqual(1);
      expect(omit(results[0], ['score'])).toEqual({
        id: _id.toString(),
        ...rest,
      });
    });

    it('can paginate search results', async () => {
      // First page
      const { results, cursor } = await (resolvers.Query.search as any)(null, {
        query: '오다',
      });

      const entry = omit(entries[2], ['score', '_id']);

      expect(results.length).toEqual(20);
      expect(cursor).toEqual(20);
      expect(omit(results[0], ['score', 'id'])).toEqual(entry);

      // Second page (start at 19)
      const { results: paginatedResults, cursor: paginatedCursor } = await (
        resolvers.Query.search as any
      )(null, { query: '오다', cursor: cursor - 1 });

      expect(paginatedResults.length).toEqual(1);
      expect(paginatedCursor).toEqual(20);
      expect(omit(paginatedResults[0], ['score', 'id'])).toEqual(entry);

      // Last page, should be empty
      const { results: noResults, cursor: noCursor } = await (
        resolvers.Query.search as any
      )(null, { query: '오다', cursor: paginatedCursor });

      expect(noResults.length).toEqual(0);
      expect(noCursor).toEqual(-1);
    });

    describe('autocorrect', () => {
      it('can autocorrect queries', async () => {
        (findCorrection as jest.Mock).mockReturnValueOnce('가다');

        const { results, cursor, autocorrected } = await (
          resolvers.Query.search as any
        )(null, {
          query: '가디',
        });

        const { _id, ...rest } = entries[1];
        expect(findCorrection).toHaveBeenCalledWith('가디');
        expect(results.length).toEqual(1);
        expect(cursor).toEqual(1);
        expect(autocorrected).toEqual('가다');
        expect(omit(results[0], ['score'])).toEqual({
          id: _id.toString(),
          ...rest,
        });
      });

      it('handles no autocorrection found', async () => {
        (findCorrection as jest.Mock).mockReturnValueOnce(null);

        const { results, cursor, autocorrected } = await (
          resolvers.Query.search as any
        )(null, {
          query: '가디',
        });

        expect(findCorrection).toHaveBeenCalledWith('가디');
        expect(results.length).toEqual(0);
        expect(cursor).toEqual(-1);
        expect(autocorrected).toEqual(undefined);
      });

      it('handles no results found', async () => {
        (findCorrection as jest.Mock).mockReturnValueOnce('no result');

        const { results, cursor, autocorrected } = await (
          resolvers.Query.search as any
        )(null, {
          query: '가디',
        });

        expect(findCorrection).toHaveBeenCalledWith('가디');
        expect(results.length).toEqual(0);
        expect(cursor).toEqual(-1);
        expect(autocorrected).toEqual('no result');
      });
    });
  });
});
