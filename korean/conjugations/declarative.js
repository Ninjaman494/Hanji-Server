const conjugator = require('../conjugator');
const hangeul = require('../hangeul');
let conjugations = {};

conjugations.declarative_present_informal_low = function(infinitive, regular, further_use) {
    infinitive = conjugator.base2(infinitive, regular);
    if (!further_use && ((infinitive.charAt(infinitive.length-1) == '이' && !infinitive.hidden_padchim &&
            !(infinitive in conjugator.regular_ees) || infinitive == '아니') ||
            (regular && infinitive.charAt(infinitive.length-1) == '이'))) {
        conjugator.reasons.push('야 irregular');
        return infinitive + '야';
    }
    // 르 irregular
    if (regular && infinitive == '이르') {
        return '일러';
    }
    if (conjugator.is_l_euh_irregular(infinitive, regular)) {
        new_base = infinitive.substring(0, infinitive.length-2) +
            hangeul.join(hangeul.lead(infinitive[infinitive.length-2]),
                hangeul.vowel(infinitive[infinitive.length-2]),
                'ᆯ');
        if (infinitive.substring(infinitive.length-2, infinitive.length) in {'푸르': true, '이르': true}) {
            new_base = new_base + hangeul.join('ᄅ',
                hangeul.vowel(hangeul.find_vowel_to_append(new_base)))
            conjugator.reasons.push('irregular stem + ' + infinitive + ' -> ' + new_base);
            return infinitive + '러';
        } else if (hangeul.find_vowel_to_append(infinitive.substring(0, infinitive.length-1)) == '아') {
            new_base += '라'
            conjugator.reasons.push('르 irregular stem change [' + infinitive + ' -> ' + new_base + ']');
            return new_base;
        } else {
            new_base += '러';
            conjugator.reasons.push('르 irregular stem change [' + infinitive + ' -> ' + new_base + ']');
            return new_base;
        }
    } else if (infinitive.charAt(infinitive.length-1) == '하') {
        return conjugator.merge(infinitive, '여');
    } else if (conjugator.is_h_irregular(infinitive, regular)) {
        return conjugator.merge(infinitive, '이');
    }
    return conjugator.merge(infinitive, hangeul.find_vowel_to_append(infinitive));
};
conjugations.declarative_present_informal_low.conjugation = true;
conjugations.declarative_present_informal_low.type =  'declarative';
conjugations.declarative_present_informal_low.tense = 'present';
conjugations.declarative_present_informal_low.speechLevel = 'informal low';

conjugations.declarative_present_informal_high = function(infinitive, regular) {
    base = conjugator.base2(infinitive, regular);
    if ((base.charAt(base.length-1) == '이' && !base.hidden_padchim &&
            !(base in conjugator.regular_ees)) ||
        base == '아니') {
        conjugator.reasons.push('에요 irregular')
        return base + '에요';
    }
    return conjugator.merge(conjugations.declarative_present_informal_low(infinitive, regular, true), '요');
};
conjugations.declarative_present_informal_high.conjugation = true;
conjugations.declarative_present_informal_high.type =  'declarative';
conjugations.declarative_present_informal_high.tense = 'present';
conjugations.declarative_present_informal_high.speechLevel = 'informal high';

conjugations.declarative_present_formal_low = function(infinitive, regular, isAdj) {
    if(isAdj){
        return conjugator.join(conjugator.base(infinitive,regular),'다');
    }

    if (conjugator.is_l_irregular(conjugator.base(infinitive), regular)) {
        return conjugator.drop_l_and_borrow_padchim(conjugator.base(infinitive, regular), '는다');
    }
    return conjugator.merge(conjugator.base(infinitive, regular), '는다');
};
conjugations.declarative_present_formal_low.conjugation = true;
conjugations.declarative_present_formal_low.type =  'declarative';
conjugations.declarative_present_formal_low.tense = 'present';
conjugations.declarative_present_formal_low.speechLevel = 'formal low';

conjugations.declarative_present_formal_high = function(infinitive, regular) {
    if (conjugator.is_l_irregular(conjugator.base(infinitive), regular)) {
        return conjugator.drop_l_and_borrow_padchim(conjugator.base(infinitive, regular), '습니다');
    }
    return conjugator.merge(conjugator.base(infinitive, regular), '습니다')
};
conjugations.declarative_present_formal_high.conjugation = true;
conjugations.declarative_present_formal_high.type =  'declarative';
conjugations.declarative_present_formal_high.tense = 'present';
conjugations.declarative_present_formal_high.speechLevel = 'formal high';

conjugations.declarative_past_informal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '어');
};
conjugations.declarative_past_informal_low.conjugation = true;
conjugations.declarative_past_informal_low.type = 'declarative';
conjugations.declarative_past_informal_low.tense = 'past';
conjugations.declarative_past_informal_low.speechLevel = 'informal low';

conjugations.declarative_past_informal_high = function(infinitive, regular) {
    return conjugator.merge(conjugations.declarative_past_informal_low(infinitive, regular), '요');
};
conjugations.declarative_past_informal_high.conjugation = true;
conjugations.declarative_past_informal_high.type = 'declarative';
conjugations.declarative_past_informal_high.tense = 'past';
conjugations.declarative_past_informal_high.speechLevel = 'informal high';

conjugations.declarative_past_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '다');
};
conjugations.declarative_past_formal_low.conjugation = true;
conjugations.declarative_past_formal_low.type = 'declarative';
conjugations.declarative_past_formal_low.tense = 'past';
conjugations.declarative_past_formal_low.speechLevel = 'formal low';

conjugations.declarative_past_formal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.past_base(infinitive, regular), '습니다');
};
conjugations.declarative_past_formal_high.conjugation = true;
conjugations.declarative_past_formal_high.type = 'declarative';
conjugations.declarative_past_formal_high.tense = 'past';
conjugations.declarative_past_formal_high.speechLevel = 'formal high';

conjugations.declarative_future_informal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.future_base(infinitive, regular), ' 거야');
};
conjugations.declarative_future_informal_low.conjugation = true;
conjugations.declarative_future_informal_low.type = 'declarative';
conjugations.declarative_future_informal_low.tense = 'future';
conjugations.declarative_future_informal_low.speechLevel = 'informal low';

conjugations.declarative_future_informal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.future_base(infinitive, regular), ' 거예요');
};
conjugations.declarative_future_informal_high.conjugation = true;
conjugations.declarative_future_informal_high.type = 'declarative';
conjugations.declarative_future_informal_high.tense = 'future';
conjugations.declarative_future_informal_high.speechLevel = 'informal high';

conjugations.declarative_future_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.future_base(infinitive, regular), ' 거다');
};
conjugations.declarative_future_formal_low.conjugation = true;
conjugations.declarative_future_formal_low.type = 'declarative';
conjugations.declarative_future_formal_low.tense = 'future';
conjugations.declarative_future_formal_low.speechLevel = 'formal low';

conjugations.declarative_future_formal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.future_base(infinitive, regular), ' 겁니다');
};
conjugations.declarative_future_formal_high.conjugation = true;
conjugations.declarative_future_formal_high.type = 'declarative';
conjugations.declarative_future_formal_high.tense = 'future';
conjugations.declarative_future_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}