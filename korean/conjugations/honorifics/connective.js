const conjugator = require('../../conjugator');
let conjugations = {};

conjugations.connective_if = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.base3(stem, regular), '면');
};
conjugations.connective_if.conjugation = true;
conjugations.connective_if.type = 'condition';
conjugations.connective_if.tense = 'none';
conjugations.connective_if.speechLevel = 'none';
conjugations.connective_if.honorific = true;

conjugations.connective_and = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(stem, '고');
};
conjugations.connective_and.conjugation = true;
conjugations.connective_and.type = 'conjunction';
conjugations.connective_and.tense = 'none';
conjugations.connective_and.speechLevel = 'none';
conjugations.connective_and.honorific = true;

conjugations.connective_but = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(stem, '지만');
};
conjugations.connective_but.conjugation = true;
conjugations.connective_but.type = 'contrast';
conjugations.connective_but.tense = 'none';
conjugations.connective_but.speechLevel = 'none';
conjugations.connective_but.honorific = true;

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation + '_honorific'] = conjugations[conjugation];
}