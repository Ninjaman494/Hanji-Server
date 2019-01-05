const conjugator = require('../conjugator');
const declarative = require('./declarative');
let conjugations = {};

conjugations.imperative_present_informal_low = function(infinitive, regular) {
    return declarative.declarative_present_informal_low(infinitive, regular);
};
conjugations.imperative_present_informal_low.conjugation = true;
conjugations.imperative_present_informal_low.type = 'imperative';
conjugations.imperative_present_informal_low.tense = 'present';
conjugations.imperative_present_informal_low.speechLevel = 'informal low';

conjugations.imperative_present_informal_high = function(infinitive, regular) {
    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '세요');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '세요');
};
conjugations.imperative_present_informal_high.conjugation = true;
conjugations.imperative_present_informal_high.type = 'imperative';
conjugations.imperative_present_informal_high.tense = 'present';
conjugations.imperative_present_informal_high.speechLevel = 'informal high';

conjugations.imperative_present_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugations.imperative_present_informal_low(infinitive, regular), '라');
};
conjugations.imperative_present_formal_low.conjugation = true;
conjugations.imperative_present_formal_low.type = 'imperative';
conjugations.imperative_present_formal_low.tense = 'present';
conjugations.imperative_present_formal_low.speechLevel = 'formal low';

conjugations.imperative_present_formal_high = function(infinitive, regular) {
    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '십시오');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '십시오');
};
conjugations.imperative_present_formal_high.conjugation = true;
conjugations.imperative_present_formal_high.type = 'imperative';
conjugations.imperative_present_formal_high.tense = 'present';
conjugations.imperative_present_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}