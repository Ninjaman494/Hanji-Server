import casual from 'casual';
import SearchAPI from '../search';

const koreanEntry = {
  id: casual.uuid,
  term: casual.string,
  pos: 'Verb',
  definitions: casual.array_of_words(3),
};
const englishEntry = {
  id: casual.uuid,
  term: casual.string,
  pos: 'Verb',
  definitions: casual.array_of_words(3),
};
const databaseMock = {
  fetchEntries: jest.fn().mockResolvedValue([koreanEntry]),
  searchEnglish: jest
    .fn()
    .mockResolvedValue({ results: [englishEntry], cursor: 1 }),
};
const datasource = new SearchAPI(databaseMock as any);

describe('SearchAPI datasource', () => {
  it('can search in Korean', async () => {
    const { results, cursor } = await datasource.search('먹다');
    expect(results).toEqual([koreanEntry]);
    expect(cursor).toBeUndefined();
  });

  it('can search in English', async () => {
    const { results, cursor } = await datasource.search('to go');
    expect(results).toEqual([englishEntry]);
    expect(cursor).toEqual(1);
  });
});
