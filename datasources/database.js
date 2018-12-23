const { DataSource } = require('apollo-datasource');

class DatabaseAPI extends DataSource {

    constructor(db) {
        super();
        this.db = db;
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

    async fetchEntries(term){
        let snapshot = await this.db.collection('words').where('term', '==', term).get();
        let entries = [];
        snapshot.forEach(doc => {
            entries.push(this.entryReducer(doc));
        });
        return entries;
    }

    async fetchEntry(id) {
        let doc = await this.db.collection('words').doc(id).get();
        return doc ? this.entryReducer(doc) : null;
    }

    entryReducer(entry){
        return {
            id: entry.id,
            term: entry.data().term,
            pos: entry.data().pos,
            definitions: entry.data().definitions,
            examples: undefined,
            antonyms: entry.data().antonyms,
            synonyms: entry.data().synonyms
        }
    }
}
module.exports = DatabaseAPI;