const conjugator = require('../conjugator');
let conjugations = {};

conjugator.imperative_present_informal_low = function(infinitive, regular) {
    return conjugator.declarative_present_informal_low(infinitive, regular);
};
conjugator.imperative_present_informal_low.conjugation = true;
conjugator.imperative_present_informal_low.type = 'imperative';
conjugator.imperative_present_informal_low.tense = 'present';
conjugator.imperative_present_informal_low.speechLevel = 'informal low';

conjugator.imperative_present_informal_high = function(infinitive, regular) {
    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '세요');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '세요');
};
conjugator.imperative_present_informal_high.conjugation = true;
conjugator.imperative_present_informal_high.type = 'imperative';
conjugator.imperative_present_informal_high.tense = 'present';
conjugator.imperative_present_informal_high.speechLevel = 'informal high';

conjugator.imperative_present_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.imperative_present_informal_low(infinitive, regular), '라');
};
conjugator.imperative_present_formal_low.conjugation = true;
conjugator.imperative_present_formal_low.type = 'imperative';
conjugator.imperative_present_formal_low.tense = 'present';
conjugator.imperative_present_formal_low.speechLevel = 'formal low';

conjugator.imperative_present_formal_high = function(infinitive, regular) {
    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '십시오');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '십시오');
};
conjugator.imperative_present_formal_high.conjugation = true;
conjugator.imperative_present_formal_high.type = 'imperative';
conjugator.imperative_present_formal_high.tense = 'present';
conjugator.imperative_present_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}