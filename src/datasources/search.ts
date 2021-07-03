import DatabaseAPI from './database';
import { DataSource } from 'apollo-datasource';
import * as hangeul from '../korean/hangeul';
import * as stemmer from '../korean/stemmer';
import { Entry, SearchResult } from './types';

class SearchAPI extends DataSource {
  databaseAPI: DatabaseAPI;

  constructor(databaseAPI: DatabaseAPI) {
    super();
    this.databaseAPI = databaseAPI;
  }

  async searchKorean(stems: Set<string>): Promise<SearchResult> {
    const entries = await Promise.all(
      Array.from(stems).map((s) => this.databaseAPI.fetchEntries(s)),
    );

    let results: Entry[] = [];
    entries.forEach((array) => {
      if (array.length > 0) {
        results = results.concat(array);
      }
    });
    return { results: results };
  }

  async search(query: string, cursor?: number): Promise<SearchResult> {
    if (hangeul.is_hangeul_string(query)) {
      const stems = stemmer.stem(query);
      stems.add(query); // in case query is already in infinitive form
      return await this.searchKorean(stems);
    } else {
      return await this.databaseAPI.searchEnglish(query, cursor);
    }
  }
}

export default SearchAPI;
