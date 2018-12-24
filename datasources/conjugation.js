const { DataSource } = require('apollo-datasource');
const conjugator = require('../korean/conjugator');

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

    fetchConjugations(stem, regular, isAdj){
        let  data = [];
        conjugator.conjugate(stem,regular,isAdj, conjugations => {
            conjugations.forEach( c =>{
                data.push(this.conjugationReducer(c));
            });
        });
        return data;
    }

    conjugationReducer(conjugation){
        return {
            name: conjugation.conjugation_name,
            conjugation: conjugation.conjugated,
            type: conjugation.type,
            tense: conjugation.tense,
            speechLevel: conjugation.speechLevel,
            honorific: conjugation.honorific
        }
    }
}
module.exports = ConjugationAPI;

/*
let r = new ConjugationAPI().fetchConjugations('가다',true,false);
console.log(r);*/
