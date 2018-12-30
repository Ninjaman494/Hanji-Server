const conjugator = require('../conjugator');
const declarative = require('./declarative')
let conjugations = {};

conjugations.interrogative_present_informal_low = function(infinitive, regular) {
    return declarative.declarative_present_informal_low(infinitive, regular);
};
conjugations.interrogative_present_informal_low.conjugation = true;
conjugations.interrogative_present_informal_low.type = 'interrogative';
conjugations.interrogative_present_informal_low.tense = 'present';
conjugations.interrogative_present_informal_low.speechLevel = 'informal low';

conjugations.interrogative_present_informal_high = function(infinitive, regular) {
    return declarative.declarative_present_informal_high(infinitive, regular);
};
conjugations.interrogative_present_informal_high.conjugation = true;
conjugations.interrogative_present_informal_high.type = 'interrogative';
conjugations.interrogative_present_informal_high.tense = 'present';
conjugations.interrogative_present_informal_high.speechLevel = 'informal high';

conjugations.interrogative_present_formal_low = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    if (conjugator.is_l_irregular(infinitive, regular)) {
        return conjugator.drop_l(infinitive, '니');
    }
    return conjugator.merge(infinitive, '니');
};
conjugations.interrogative_present_formal_low.conjugation = true;
conjugations.interrogative_present_formal_low.type = 'interrogative';
conjugations.interrogative_present_formal_low.tense = 'present';
conjugations.interrogative_present_formal_low.speechLevel = 'formal low';

conjugations.interrogative_present_formal_high = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    if (conjugator.is_l_irregular(infinitive, regular)) {
        return conjugator.drop_l_and_borrow_padchim(infinitive, '습니까');
    }
    return conjugator.merge(infinitive, '습니까');
};
conjugations.interrogative_present_formal_high.conjugation = true;
conjugations.interrogative_present_formal_high.type = 'interrogative';
conjugations.interrogative_present_formal_high.tense = 'present';
conjugations.interrogative_present_formal_high.speechLevel = 'formal high';

conjugations.interrogative_past_informal_low = function(infinitive, regular) {
    return declarative.declarative_past_informal_low(infinitive, regular);
};
conjugations.interrogative_past_informal_low.conjugation = true;
conjugations.interrogative_past_informal_low.type = 'interrogative';
conjugations.interrogative_past_informal_low.tense = 'past';
conjugations.interrogative_past_informal_low.speechLevel = 'informal low';

conjugations.interrogative_past_informal_high = function(infinitive, regular) {
    return declarative.declarative_past_informal_high(infinitive, regular);
};
conjugations.interrogative_past_informal_high.conjugation = true;
conjugations.interrogative_past_informal_high.type = 'interrogative';
conjugations.interrogative_past_informal_high.tense = 'past';
conjugations.interrogative_past_informal_high.speechLevel = 'informal high';

conjugations.interrogative_past_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '니');
};
conjugations.interrogative_past_formal_low.conjugation = true;
conjugations.interrogative_past_formal_low.type = 'interrogative';
conjugations.interrogative_past_formal_low.tense = 'past';
conjugations.interrogative_past_formal_low.speechLevel = 'formal low';

conjugations.interrogative_past_formal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '습니까');
};
conjugations.interrogative_past_formal_high.conjugation = true;
conjugations.interrogative_past_formal_high.type = 'interrogative';
conjugations.interrogative_past_formal_high.tense = 'past';
conjugations.interrogative_past_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}