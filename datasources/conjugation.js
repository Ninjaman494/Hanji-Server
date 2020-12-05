const { DataSource } = require('apollo-datasource');
const conjugator = require('../korean/conjugator');
const stemmer = require('../korean/stemmer');

class ConjugationAPI extends DataSource {

    constructor() {
        super();
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

    fetchConjugations(stem, isAdj, honorific, regular, conjugationNames){
        if(regular === null || regular === undefined) {
            // returns either 'regular verb' or type of irregular
            regular = conjugator.verb_type(stem, false) === 'regular verb';
        }

        if(conjugationNames != null) {
            for (let i = 0; i < conjugationNames.length; i++) {
                conjugationNames[i] = conjugationNames[i].toLowerCase();
            }
        }

        let  data = [];
        conjugator.conjugate(stem, regular, isAdj, honorific, conjugations => {
            conjugations.forEach( c =>{
                let conjugation = ConjugationAPI.conjugationReducer(c);
                // If a list of conjugations was provided, check if this conjugation is part of the list
                if(conjugationNames != null && conjugationNames.includes(conjugation.name)) {
                    data.push(conjugation);
                } else if(conjugationNames == null) {  // No list was provided, add all conjugations
                    data.push(conjugation)
                }
            });
        });
        return data;
    }

    fetchFavorites(stem, isAdj, regular, favorites) {
        if(regular === null || regular === undefined) {
            // returns either 'regular verb' or type of irregular
            regular = conjugator.verb_type(stem, false) === 'regular verb';
        }

        const data = [];
        favorites.forEach(fav => {
           const conjugation = conjugator.conjugate_one(stem, regular, isAdj, fav.honorific, fav.conjugationName);

           data.push(ConjugationAPI.conjugationReducer(conjugation));
        });

        return data;
    }

    // noinspection JSMethodCanBeStatic
    fetchConjugationTypes() {
        return Array.from(conjugator.getTypes());
    }

    // noinspection JSMethodCanBeStatic
    fetchConjugationNames() {
        return Array.from(conjugator.getNames());
    }

    // noinspection JSMethodCanBeStatic
    fetchStems(query) {
        let stems = stemmer.stem(query);
        if (query[query.length - 1] === '다') {
            stems.add(query); // in case query is already in infinitive form
        }
        return Array.from(stems);
    }

    static conjugationReducer(conjugation){
        return {
            name: conjugation.conjugation_name,
            conjugation: conjugation.conjugated,
            type: conjugation.type,
            tense: conjugation.tense,
            speechLevel: conjugation.speechLevel,
            honorific: conjugation.honorific,
            pronunciation: conjugation.pronunciation,
            romanization: conjugation.romanized,
            reasons: conjugation.reasons
        }
    }
}
module.exports = ConjugationAPI;