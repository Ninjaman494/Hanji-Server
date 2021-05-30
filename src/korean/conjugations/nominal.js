const conjugator = require('../conjugator');
let conjugations = {};

conjugations.nominal_ing = function(infinitive, regular) {
    return conjugator.merge(conjugator.base3(infinitive, regular), '음');
};
conjugations.nominal_ing.conjugation = true;
conjugations.nominal_ing.type = 'verbal noun';
conjugations.nominal_ing.tense = 'none';
conjugations.nominal_ing.speechLevel = 'none';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}