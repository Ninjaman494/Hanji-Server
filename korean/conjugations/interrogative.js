const conjugator = require('../conjugator');
let conjugations = {};

conjugator.interrogative_present_informal_low = function(infinitive, regular) {
    return conjugator.declarative_present_informal_low(infinitive, regular);
};
conjugator.interrogative_present_informal_low.conjugation = true;
conjugator.interrogative_present_informal_low.type = 'interrogative';
conjugator.interrogative_present_informal_low.tense = 'present';
conjugator.interrogative_present_informal_low.speechLevel = 'informal low';

conjugator.interrogative_present_informal_high = function(infinitive, regular) {
    return conjugator.declarative_present_informal_high(infinitive, regular);
};
conjugator.interrogative_present_informal_high.conjugation = true;
conjugator.interrogative_present_informal_high.type = 'interrogative';
conjugator.interrogative_present_informal_high.tense = 'present';
conjugator.interrogative_present_informal_high.speechLevel = 'informal high';

conjugator.interrogative_present_formal_low = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    if (conjugator.is_l_irregular(infinitive, regular)) {
        return conjugator.drop_l(infinitive, '니');
    }
    return conjugator.merge(infinitive, '니');
};
conjugator.interrogative_present_formal_low.conjugation = true;
conjugator.interrogative_present_formal_low.type = 'interrogative';
conjugator.interrogative_present_formal_low.tense = 'present';
conjugator.interrogative_present_formal_low.speechLevel = 'formal low';

conjugator.interrogative_present_formal_high = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    if (conjugator.is_l_irregular(infinitive, regular)) {
        return conjugator.drop_l_and_borrow_padchim(infinitive, '습니까');
    }
    return conjugator.merge(infinitive, '습니까');
};
conjugator.interrogative_present_formal_high.conjugation = true;
conjugator.interrogative_present_formal_high.type = 'interrogative';
conjugator.interrogative_present_formal_high.tense = 'present';
conjugator.interrogative_present_formal_high.speechLevel = 'formal high';

conjugator.interrogative_past_informal_low = function(infinitive, regular) {
    return conjugator.declarative_past_informal_low(infinitive, regular);
};
conjugator.interrogative_past_informal_low.conjugation = true;
conjugator.interrogative_past_informal_low.type = 'interrogative';
conjugator.interrogative_past_informal_low.tense = 'past';
conjugator.interrogative_past_informal_low.speechLevel = 'informal low';

conjugator.interrogative_past_informal_high = function(infinitive, regular) {
    return conjugator.declarative_past_informal_high(infinitive, regular);
};
conjugator.interrogative_past_informal_high.conjugation = true;
conjugator.interrogative_past_informal_high.type = 'interrogative';
conjugator.interrogative_past_informal_high.tense = 'past';
conjugator.interrogative_past_informal_high.speechLevel = 'informal high';

conjugator.interrogative_past_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '니');
};
conjugator.interrogative_past_formal_low.conjugation = true;
conjugator.interrogative_past_formal_low.type = 'interrogative';
conjugator.interrogative_past_formal_low.tense = 'past';
conjugator.interrogative_past_formal_low.speechLevel = 'formal low';

conjugator.interrogative_past_formal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '습니까');
};
conjugator.interrogative_past_formal_high.conjugation = true;
conjugator.interrogative_past_formal_high.type = 'interrogative';
conjugator.interrogative_past_formal_high.tense = 'past';
conjugator.interrogative_past_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}