const { DataSource } = require('apollo-datasource');
const MongoClient = require('mongodb').MongoClient;
const URI = "***REMOVED***";

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
        const mongo = new MongoClient(URI, { useNewUrlParser: true });
        await mongo.connect();
        let results = await mongo
            .db("hanji")
            .collection("words")
            .find({ term: term })
            .toArray();
        mongo.close();

        let entries = [];
        results.forEach(doc => {
            entries.push(DatabaseAPI.entryReducer(doc));
        });
        return entries;
    }

    async fetchEntry(id) {
        const mongo = new MongoClient(URI, { useNewUrlParser: true });
        await mongo.connect();
        let results = await mongo
            .db("hanji")
            .collection("words")
            .find({ _id: id })
            .toArray();
        mongo.close();
        if(results.length > 0) {
            return DatabaseAPI.entryReducer(results[0]);
        } else {
            return  null;
        }
    }

    async fetchExamples(id) {
        const mongo = new MongoClient(URI, { useNewUrlParser: true });
        await mongo.connect();
        let results = await mongo
            .db("hanji")
            .collection("words")
            .find({ _id: id }, { projection: { examples: 1 } })
            .toArray();
        mongo.close();

        if(results.length > 0 && results[0].examples) {
            return DatabaseAPI.exampleReducer(results[0].examples);
        } else {
            return  [];
        }
    }

    static exampleReducer(examples){
        let reducedExamples = [];
        examples.forEach(example => {
            reducedExamples.push({
                sentence: example.sentence,
                translation: example.translation
            });
        });
        return reducedExamples;
    }

    static entryReducer(entry){
        let data = {
            id: entry._id,
            term: entry.term,
            pos: entry.pos,
            definitions: entry.definitions
        };
        if(entry.examples) {
            data.examples = DatabaseAPI.exampleReducer(entry.examples)
        }
        if(entry.antonyms) {
            data.antonyms = entry.antonyms;
        }
        if(entry.synonyms){
            data.synonyms = entry.synonyms;
        }
        if(entry.regular) {
            data.regular = entry.regular;
        }
        if(entry.note) {
            data.note = entry.note;
        }

        return data;
    }
}
module.exports = DatabaseAPI;