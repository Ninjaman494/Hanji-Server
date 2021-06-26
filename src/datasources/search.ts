import DatabaseAPI from './database';
import { DataSource } from 'apollo-datasource';
const hangeul = require('../korean/hangeul');
const stemmer = require('../korean/stemmer');

class SearchAPI extends DataSource {
  databaseAPI: DatabaseAPI;
  context: unknown;

  constructor(databaseAPI: DatabaseAPI) {
    super();
    this.databaseAPI = databaseAPI;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  async searchKorean(stems: Set<string>) {
    const entries = await Promise.all(
      Array.from(stems).map((s) => this.databaseAPI.fetchEntries(s)),
    );

    let results = [];
    entries.forEach((array) => {
      if (array.length > 0) {
        results = results.concat(array);
      }
    });
    return { results: results };
  }

  async search(query: string, cursor?: number) {
    if (hangeul.is_hangeul_string(query)) {
      let stems = stemmer.stem(query);
      stems.add(query); // in case query is already in infinitive form
      return await this.searchKorean(stems);
    } else {
      return await this.databaseAPI.searchEnglish(query, cursor);
    }
  }
}

export default SearchAPI;
