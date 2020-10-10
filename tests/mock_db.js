const { DataSource } = require('apollo-datasource');
const casual = require('casual');

class MockDatabaseAPI extends DataSource {
    constructor() {
        super();
    }

    initialize(config) {
        this.context = config.context;
    }

    async fetchEntries(term) {
        let entries = [];
        let n = casual.integer(1, 4);
        for(let i = 0;i<n;i++) {
            let entry = this.fetchEntry(casual.word);
            entry.term = term;
            entries.push(entry);
        }
        return entries;
    }

    async fetchEntry(id) {
        return {
            id: id,
            term: casual.word,
            pos: casual.word,
            definitions: casual.array_of_words(3),
            examples:this.fetchExamples(id),
            antonyms: casual.array_of_words(3),
            synonyms: casual.array_of_words(3),
            regular: casual.boolean,
            note: casual.sentence
        }
    }

    async fetchExamples(id) {
        let examples = [];
        let n = casual.integer(1, 4);
        for(let i = 0;i<n;i++) {
            examples.push({
                sentence: casual.sentence,
                translation: casual.sentence
            })
        }
        return examples;

    }

    async searchEnglish(query, cursor) {
        return {
            cursor: casual.integer(0, 20),
            results: this.fetchEntries(query)
        }
    }

    async fetchWordoftheDay() {
        return this.fetchEntry(casual.word);
    }
}
module.exports = MockDatabaseAPI;