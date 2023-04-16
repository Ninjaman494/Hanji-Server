const conjugator = require('../../conjugator');
const declarative = require('./declarative');
let conjugations = {};

conjugations.propositive_informal_low = function(infinitive, regular) {
    return declarative.declarative_present_informal_low_honorific(infinitive, regular);
};
conjugations.propositive_informal_low.conjugation = true;
conjugations.propositive_informal_low.type = 'propositive';
conjugations.propositive_informal_low.tense = 'present';
conjugations.propositive_informal_low.speechLevel = 'informal low';
conjugations.propositive_informal_low.honorific = true;

conjugations.propositive_informal_high = function(infinitive, regular) {
    return declarative.declarative_present_informal_high_honorific(infinitive, regular);
};
conjugations.propositive_informal_high.conjugation = true;
conjugations.propositive_informal_high.type = 'propositive';
conjugations.propositive_informal_high.tense = 'present';
conjugations.propositive_informal_high.speechLevel = 'informal high';
conjugations.propositive_informal_high.honorific = true;

conjugations.propositive_formal_low = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.base(stem, regular), '자');
};
conjugations.propositive_formal_low.conjugation = true;
conjugations.propositive_formal_low.type = 'propositive';
conjugations.propositive_formal_low.tense = 'present';
conjugations.propositive_formal_low.speechLevel = 'formal low';
conjugations.propositive_formal_low.honorific = true;

conjugations.propositive_formal_high = function(infinitive, regular) {
    if(conjugator.isAlwaysHonorific(infinitive)) {
        infinitive = conjugator.stripHonorific(infinitive, regular);
    }
    infinitive = conjugator.base(infinitive);

    if (conjugator.is_l_irregular(infinitive, regular)) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '십시다');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '십시다');
};
conjugations.propositive_formal_high.conjugation = true;
conjugations.propositive_formal_high.type = 'propositive';
conjugations.propositive_formal_high.tense = 'present';
conjugations.propositive_formal_high.speechLevel = 'formal high';
conjugations.propositive_formal_high.honorific = true;

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation + '_honorific'] = conjugations[conjugation];
}