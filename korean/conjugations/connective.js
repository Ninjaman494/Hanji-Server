const conjugator = require('../conjugator');
let conjugations = {};

conjugator.connective_if = function(infinitive, regular) {
    return conjugator.merge(conjugator.base3(infinitive, regular), '면');
};
conjugator.connective_if.conjugation = true;
conjugator.connective_if.type = 'condition';
conjugator.connective_if.tense = 'none';
conjugator.connective_if.speechLevel = 'none';

conjugator.connective_and = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    return conjugator.merge(conjugator.base(infinitive, regular), '고');
};
conjugator.connective_and.conjugation = true;
conjugator.connective_and.type = 'conjunction';
conjugator.connective_and.tense = 'none';
conjugator.connective_and.speechLevel = 'none';

conjugator.connective_but = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    return conjugator.merge(conjugator.base(infinitive, regular), '지만');
};
conjugator.connective_but.conjugation = true;
conjugator.connective_but.type = 'contrast';
conjugator.connective_but.tense = 'none';
conjugator.connective_but.speechLevel = 'none';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}