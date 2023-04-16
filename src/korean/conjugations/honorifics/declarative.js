const conjugator = require('../../conjugator');
const hangeul = require('../../hangeul');
const declarative = require('../declarative');
let conjugations = {};

conjugations.declarative_present_informal_low = function(infinitive, regular, further_use) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return declarative.declarative_present_informal_low(stem,regular,further_use);
};
conjugations.declarative_present_informal_low.conjugation = true;
conjugations.declarative_present_informal_low.type =  'declarative present';
conjugations.declarative_present_informal_low.tense = 'present';
conjugations.declarative_present_informal_low.speechLevel = 'informal low';
conjugations.declarative_present_informal_low.honorific = true;

conjugations.declarative_present_informal_high = function(infinitive, regular) {
    // if always honorific, drop 시
    infinitive = conjugator.maybeStripHonorific(infinitive, regular);

    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '세요');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '세요');
};
conjugations.declarative_present_informal_high.conjugation = true;
conjugations.declarative_present_informal_high.type =  'declarative present';
conjugations.declarative_present_informal_high.tense = 'present';
conjugations.declarative_present_informal_high.speechLevel = 'informal high';
conjugations.declarative_present_informal_high.honorific = true;

conjugations.declarative_present_formal_low = function(infinitive, regular, isAdj) {
    let stem  = conjugator.add_honorific(infinitive,regular);
    if(isAdj || conjugator.is_itda_obda(infinitive,regular)){
        return conjugator.join(stem,'다');
    }else {
        return conjugator.merge(stem,'는다');
    }
};
conjugations.declarative_present_formal_low.conjugation = true;
conjugations.declarative_present_formal_low.type =  'declarative present';
conjugations.declarative_present_formal_low.tense = 'present';
conjugations.declarative_present_formal_low.speechLevel = 'formal low';
conjugations.declarative_present_formal_low.honorific = true;

conjugations.declarative_present_formal_high = function(infinitive, regular) {
    infinitive = conjugator.maybeStripHonorific(infinitive, regular);

    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '십니다');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '십니다');
};
conjugations.declarative_present_formal_high.conjugation = true;
conjugations.declarative_present_formal_high.type =  'declarative present';
conjugations.declarative_present_formal_high.tense = 'present';
conjugations.declarative_present_formal_high.speechLevel = 'formal high';
conjugations.declarative_present_formal_high.honorific = true;

conjugations.declarative_past_informal_low = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.past_base(stem, regular), '어');
};
conjugations.declarative_past_informal_low.conjugation = true;
conjugations.declarative_past_informal_low.type = 'declarative past';
conjugations.declarative_past_informal_low.tense = 'past';
conjugations.declarative_past_informal_low.speechLevel = 'informal low';
conjugations.declarative_past_informal_low.honorific = true;

conjugations.declarative_past_informal_high = function(infinitive, regular) {
    return conjugator.merge(conjugations.declarative_past_informal_low(infinitive, regular), '요');
};
conjugations.declarative_past_informal_high.conjugation = true;
conjugations.declarative_past_informal_high.type = 'declarative past';
conjugations.declarative_past_informal_high.tense = 'past';
conjugations.declarative_past_informal_high.speechLevel = 'informal high';
conjugations.declarative_past_informal_high.honorific = true;

conjugations.declarative_past_formal_low = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.past_base(stem, regular), '다');
};
conjugations.declarative_past_formal_low.conjugation = true;
conjugations.declarative_past_formal_low.type = 'declarative past';
conjugations.declarative_past_formal_low.tense = 'past';
conjugations.declarative_past_formal_low.speechLevel = 'formal low';
conjugations.declarative_past_formal_low.honorific = true;

conjugations.declarative_past_formal_high = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.past_base(stem, regular), '습니다');
};
conjugations.declarative_past_formal_high.conjugation = true;
conjugations.declarative_past_formal_high.type = 'declarative past';
conjugations.declarative_past_formal_high.tense = 'past';
conjugations.declarative_past_formal_high.speechLevel = 'formal high';
conjugations.declarative_past_formal_high.honorific = true;

conjugations.declarative_future_informal_low = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.future_base(stem, regular), ' 거야');
};
conjugations.declarative_future_informal_low.conjugation = true;
conjugations.declarative_future_informal_low.type = 'declarative future';
conjugations.declarative_future_informal_low.tense = 'future';
conjugations.declarative_future_informal_low.speechLevel = 'informal low';
conjugations.declarative_future_informal_low.honorific = true;

conjugations.declarative_future_informal_high = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.future_base(stem, regular), ' 거예요');
};
conjugations.declarative_future_informal_high.conjugation = true;
conjugations.declarative_future_informal_high.type = 'declarative future';
conjugations.declarative_future_informal_high.tense = 'future';
conjugations.declarative_future_informal_high.speechLevel = 'informal high';
conjugations.declarative_future_informal_high.honorific = true;

conjugations.declarative_future_formal_low = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.future_base(stem, regular), ' 거다');
};
conjugations.declarative_future_formal_low.conjugation = true;
conjugations.declarative_future_formal_low.type = 'declarative future';
conjugations.declarative_future_formal_low.tense = 'future';
conjugations.declarative_future_formal_low.speechLevel = 'formal low';
conjugations.declarative_future_formal_low.honorific = true;

conjugations.declarative_future_formal_high = function(infinitive, regular) {
    let stem = conjugator.add_honorific(infinitive,regular);
    return conjugator.merge(conjugator.future_base(stem, regular), ' 겁니다');
};
conjugations.declarative_future_formal_high.conjugation = true;
conjugations.declarative_future_formal_high.type = 'declarative future';
conjugations.declarative_future_formal_high.tense = 'future';
conjugations.declarative_future_formal_high.speechLevel = 'formal high';
conjugations.declarative_future_formal_high.honorific = true;

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation + '_honorific'] = conjugations[conjugation];
}