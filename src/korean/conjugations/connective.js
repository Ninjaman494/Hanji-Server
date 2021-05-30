const conjugator = require('../conjugator');
let conjugations = {};

conjugations.connective_if = function(infinitive, regular) {
    return conjugator.merge(conjugator.base3(infinitive, regular), '면');
};
conjugations.connective_if.conjugation = true;
conjugations.connective_if.type = 'connective';
conjugations.connective_if.tense = 'none';
conjugations.connective_if.speechLevel = 'none';

conjugations.connective_and = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    return conjugator.merge(conjugator.base(infinitive, regular), '고');
};
conjugations.connective_and.conjugation = true;
conjugations.connective_and.type = 'connective';
conjugations.connective_and.tense = 'none';
conjugations.connective_and.speechLevel = 'none';

conjugations.connective_but = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    return conjugator.merge(conjugator.base(infinitive, regular), '지만');
};
conjugations.connective_but.conjugation = true;
conjugations.connective_but.type = 'connective';
conjugations.connective_but.tense = 'none';
conjugations.connective_but.speechLevel = 'none';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}