const conjugator = require('../../conjugator');
const declarative = require('./declarative');
let conjugations = {};

conjugations.interrogative_present_informal_low = function(infinitive, regular) {
    return declarative.declarative_present_informal_low_honorific(infinitive, regular);
};
conjugations.interrogative_present_informal_low.conjugation = true;
conjugations.interrogative_present_informal_low.type = 'interrogative present';
conjugations.interrogative_present_informal_low.tense = 'present';
conjugations.interrogative_present_informal_low.speechLevel = 'informal low';
conjugations.interrogative_present_informal_low.honorific = true;

conjugations.interrogative_present_informal_high = function(infinitive, regular) {
    return declarative.declarative_present_informal_high_honorific(infinitive, regular);
};
conjugations.interrogative_present_informal_high.conjugation = true;
conjugations.interrogative_present_informal_high.type = 'interrogative present';
conjugations.interrogative_present_informal_high.tense = 'present';
conjugations.interrogative_present_informal_high.speechLevel = 'informal high';
conjugations.interrogative_present_informal_high.honorific = true;

conjugations.interrogative_present_formal_low = function(infinitive, regular, isAdj) {
    let stem = conjugator.add_honorific(infinitive,regular);
    if(isAdj || conjugator.is_itda_obda(infinitive,regular)) {
        return conjugator.merge(stem, '냐');
    }else{
        return conjugator.merge(stem,'느냐');
    }
};
conjugations.interrogative_present_formal_low.conjugation = true;
conjugations.interrogative_present_formal_low.type = 'interrogative present';
conjugations.interrogative_present_formal_low.tense = 'present';
conjugations.interrogative_present_formal_low.speechLevel = 'formal low';
conjugations.interrogative_present_formal_low.honorific = true;

conjugations.interrogative_present_formal_high = function(infinitive, regular) {
    infinitive = conjugator.stripHonorific(infinitive, regular);

    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '십니까');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '십니까');
};
conjugations.interrogative_present_formal_high.conjugation = true;
conjugations.interrogative_present_formal_high.type = 'interrogative present';
conjugations.interrogative_present_formal_high.tense = 'present';
conjugations.interrogative_present_formal_high.speechLevel = 'formal high';
conjugations.interrogative_present_formal_high.honorific = true;

conjugations.interrogative_past_informal_low = function(infinitive, regular) {
    return declarative.declarative_past_informal_low_honorific(infinitive, regular);
};
conjugations.interrogative_past_informal_low.conjugation = true;
conjugations.interrogative_past_informal_low.type = 'interrogative past';
conjugations.interrogative_past_informal_low.tense = 'past';
conjugations.interrogative_past_informal_low.speechLevel = 'informal low';
conjugations.interrogative_past_informal_low.honorific = true;

conjugations.interrogative_past_informal_high = function(infinitive, regular) {
    return declarative.declarative_past_informal_high_honorific(infinitive, regular);
};
conjugations.interrogative_past_informal_high.conjugation = true;
conjugations.interrogative_past_informal_high.type = 'interrogative past';
conjugations.interrogative_past_informal_high.tense = 'past';
conjugations.interrogative_past_informal_high.speechLevel = 'informal high';
conjugations.interrogative_past_informal_high.honorific = true;

conjugations.interrogative_past_formal_low = function(infinitive, regular, isAdj) {
    let stem = conjugator.add_honorific(infinitive,regular);
    if(isAdj || conjugator.is_itda_obda(infinitive,regular)) {
        return conjugator.merge(conjugator.past_base(stem, regular), '냐');
    }else{
        return conjugator.merge(conjugator.past_base(stem, regular),'느냐');
    }
};
conjugations.interrogative_past_formal_low.conjugation = true;
conjugations.interrogative_past_formal_low.type = 'interrogative past';
conjugations.interrogative_past_formal_low.tense = 'past';
conjugations.interrogative_past_formal_low.speechLevel = 'formal low';
conjugations.interrogative_past_formal_low.honorific = true;

conjugations.interrogative_past_formal_high = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.past_base(stem, regular), '습니까');
};
conjugations.interrogative_past_formal_high.conjugation = true;
conjugations.interrogative_past_formal_high.type = 'interrogative past';
conjugations.interrogative_past_formal_high.tense = 'past';
conjugations.interrogative_past_formal_high.speechLevel = 'formal high';
conjugations.interrogative_past_formal_high.honorific = true;

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation + '_honorific'] = conjugations[conjugation];
}