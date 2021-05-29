const conjugator = require('../../conjugator');
let conjugations = {};

conjugations.nominal_ing = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.base3(stem, regular), '음');
};
conjugations.nominal_ing.conjugation = true;
conjugations.nominal_ing.type = 'verbal noun';
conjugations.nominal_ing.tense = 'none';
conjugations.nominal_ing.speechLevel = 'none';
conjugations.nominal_ing.honorific = true;

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation + '_honorific'] = conjugations[conjugation];
}