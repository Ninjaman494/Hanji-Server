const { DataSource } = require('apollo-datasource');
const rp = require('request-promise');
const hangeul = require('../korean/hangeul');
const stemmer = require('../korean/stemmer');

class SearchAPI extends DataSource {

    constructor(databaseAPI) {
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

    async searchEnglish(query, cursor) {
        let promises = [];

        let url = cursor != null ? encodeURI(process.env.SEARCH_URL + `${query}&cursor=${cursor}`) : encodeURI(process.env.SEARCH_URL + `${query}` );
        let searchResult = await rp({ uri: url, json: true}).catch(function (err) {
            console.log(err);
        });
        searchResult.results.forEach(id => {
            promises.push(this.databaseAPI.fetchEntry(id)); // start fetching for each id
        });
        let results = await Promise.all(promises); // wait for promises to resolve
        return {
          'cursor': searchResult.cursor,
          'results': results
        };
    }

    async searchKorean(stems){
        let promises = [];
        stems.forEach(stem => {
            promises.push(this.databaseAPI.fetchEntries(stem));
        });

        // Remove empty arrays from fetchEntries' result
        let results = [];
        let entries = await Promise.all(promises);
        entries.forEach(array => {
            if(array.length > 0){
                results = results.concat(array);
            }
        });
        return { 'results': results };
    }

    async search(query, cursor){
        if(hangeul.is_hangeul_string(query)){
            let stems = stemmer.stem(query);
            stems.add(query); // in case query is already in infinitive form
            return await this.searchKorean(stems);
        } else {
            return await this.searchEnglish(query, cursor);
        }
    }
}
module.exports = SearchAPI;