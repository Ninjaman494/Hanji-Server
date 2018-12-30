const conjugator = require('../conjugator');
let conjugations = {};

conjugator.nominal_ing = function(infinitive, regular) {
    return conjugator.merge(conjugator.base3(infinitive, regular), '음');
};
conjugator.nominal_ing.conjugation = true;
conjugator.nominal_ing.type = 'verbal noun';
conjugator.nominal_ing.tense = 'none';
conjugator.nominal_ing.speechLevel = 'none';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}