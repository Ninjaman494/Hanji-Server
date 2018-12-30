const conjugator = require('../conjugator');
const declarative = require('./declarative');
let conjugations = {};

conjugations.propositive_present_informal_low = function(infinitive, regular) {
    return declarative.declarative_present_informal_low(infinitive, regular);
};
conjugations.propositive_present_informal_low.conjugation = true;
conjugations.propositive_present_informal_low.type = 'propositive';
conjugations.propositive_present_informal_low.tense = 'present';
conjugations.propositive_present_informal_low.speechLevel = 'informal low';

conjugations.propositive_present_informal_high = function(infinitive, regular) {
    return declarative.declarative_present_informal_high(infinitive, regular);
};
conjugations.propositive_present_informal_high.conjugation = true;
conjugations.propositive_present_informal_high.type = 'propositive';
conjugations.propositive_present_informal_high.tense = 'present';
conjugations.propositive_present_informal_high.speechLevel = 'informal high';

conjugations.propositive_present_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.base(infinitive, regular), '자');
};
conjugations.propositive_present_formal_low.conjugation = true;
conjugations.propositive_present_formal_low.type = 'propositive';
conjugations.propositive_present_formal_low.tense = 'present';
conjugations.propositive_present_formal_low.speechLevel = 'formal low';

conjugations.propositive_present_formal_high = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive);
    if (conjugator.is_l_irregular(infinitive, regular)) {
        return conjugator.drop_l_and_borrow_padchim(conjugator.base3(infinitive, regular), '읍시다');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '읍시다');
};
conjugations.propositive_present_formal_high.conjugation = true;
conjugations.propositive_present_formal_high.type = 'propositive';
conjugations.propositive_present_formal_high.tense = 'present';
conjugations.propositive_present_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}