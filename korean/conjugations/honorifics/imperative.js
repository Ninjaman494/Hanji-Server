const conjugator = require('../../conjugator');
const declarative = require('./declarative');
const imperative = require('../imperative');
let conjugations = {};

conjugations.imperative_informal_low = function(infinitive, regular) {
    return declarative.declarative_present_informal_low_honorific(infinitive, regular);
};
conjugations.imperative_informal_low.conjugation = true;
conjugations.imperative_informal_low.type = 'imperative';
conjugations.imperative_informal_low.tense = 'present';
conjugations.imperative_informal_low.speechLevel = 'informal low';
conjugations.imperative_informal_low.honorific = true;

conjugations.imperative_informal_high = function(infinitive, regular) {
    return declarative.declarative_present_informal_high_honorific(infinitive,regular);
};
conjugations.imperative_informal_high.conjugation = true;
conjugations.imperative_informal_high.type = 'imperative';
conjugations.imperative_informal_high.tense = 'present';
conjugations.imperative_informal_high.speechLevel = 'informal high';
conjugations.imperative_informal_high.honorific = true;

conjugations.imperative_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugations.imperative_informal_low(infinitive, regular), '라');
};
conjugations.imperative_formal_low.conjugation = true;
conjugations.imperative_formal_low.type = 'imperative';
conjugations.imperative_formal_low.tense = 'present';
conjugations.imperative_formal_low.speechLevel = 'formal low';
conjugations.imperative_formal_low.honorific = true;

conjugations.imperative_formal_high = function(infinitive, regular) {
    return imperative.imperative_formal_high(infinitive,regular);
};
conjugations.imperative_formal_high.conjugation = true;
conjugations.imperative_formal_high.type = 'imperative';
conjugations.imperative_formal_high.tense = 'present';
conjugations.imperative_formal_high.speechLevel = 'formal high';
conjugations.imperative_formal_high.honorific = true;

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation + '_honorific'] = conjugations[conjugation];
}