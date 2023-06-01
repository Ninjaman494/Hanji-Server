jest.mock('features/autocorrect/autocorrect');

import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import { setupMockDB, teardownDB } from 'tests/utils';
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
    it('resolves search queries', async () => {
      const { results, cursor } = await (resolvers.Query.search as any)(null, {
        query: 'kimchi',
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
        query: 'to go',
      });

      const toGoEntry = omit(entries[1], ['score', '_id']);
      const toGoOutEntry = omit(entries[2], ['score', '_id']);

      expect(results.length).toEqual(20);
      expect(cursor).toEqual(20);
      expect(omit(results[0], ['score', 'id'])).toEqual(toGoEntry);
      expect(omit(results[1], ['score', 'id'])).toEqual(toGoOutEntry);

      // Second page
      const { results: paginatedResults, cursor: paginatedCursor } = await (
        resolvers.Query.search as any
      )(null, { query: 'to go', cursor });

      expect(paginatedResults.length).toEqual(1);
      expect(paginatedCursor).toEqual(21);
      expect(omit(paginatedResults[0], ['score', 'id'])).toEqual(toGoOutEntry);

      // Last page, should be empty
      const { results: noResults, cursor: noCursor } = await (
        resolvers.Query.search as any
      )(null, { query: 'to go', cursor: paginatedCursor });

      expect(noResults.length).toEqual(0);
      expect(noCursor).toEqual(-1);
    });
  });

  describe('Korean', () => {
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

    it('can autocorrect queries', async () => {
      (findCorrection as jest.Mock).mockReturnValueOnce('가다');

      const { results, cursor } = await (resolvers.Query.search as any)(null, {
        query: '가디',
      });

      const { _id, ...rest } = entries[1];
      expect(findCorrection).toHaveBeenCalledWith('가디');
      expect(results.length).toEqual(1);
      expect(cursor).toEqual(1);
      expect(omit(results[0], ['score'])).toEqual({
        id: _id.toString(),
        ...rest,
      });
    });
  });
});
