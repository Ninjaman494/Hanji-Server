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

    async searchEnglish(query){
        let promises = [];

        let url = encodeURI(process.env.SEARCH_URL + `${query}`);
        let ids = await rp({ uri: url, json: true}).catch(function (err) {
            console.log(err);
        });
        ids.forEach(id => {
            promises.push(this.databaseAPI.fetchEntry(id)); // start fetching for each id
        });
        return await Promise.all(promises); // wait for promises to resolve, then return resulting documents
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
        return results;
    }

    async search(query){
        if(hangeul.is_hangeul_string(query)){
            return await this.searchKorean(stemmer.stem(query).map(element => { return element.key; }));
        } else {
            return await this.searchEnglish(query);
        }
    }
}
module.exports = SearchAPI;