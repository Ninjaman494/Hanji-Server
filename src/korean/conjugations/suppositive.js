const conjugator = require('../conjugator');
let conjugations = {};

conjugations.suppositive_informal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.base(infinitive, regular), '겠어');
};
conjugations.suppositive_informal_low.conjugation = true;
conjugations.suppositive_informal_low.type = 'suppositive';
conjugations.suppositive_informal_low.tense = 'none';
conjugations.suppositive_informal_low.speechLevel = 'informal low';

conjugations.suppositive_informal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.base(infinitive, regular), '겠어요');
};
conjugations.suppositive_informal_high.conjugation = true;
conjugations.suppositive_informal_high.type = 'suppositive';
conjugations.suppositive_informal_high.tense = 'none';
conjugations.suppositive_informal_high.speechLevel = 'informal high';

conjugations.suppositive_formal_low = function(infinitive, regular) {
    return conjugator.merge(conjugator.base(infinitive, regular), '겠다');
};
conjugations.suppositive_formal_low.conjugation = true;
conjugations.suppositive_formal_low.type = 'suppositive';
conjugations.suppositive_formal_low.tense = 'none';
conjugations.suppositive_formal_low.speechLevel = 'formal low';

conjugations.suppositive_formal_high = function(infinitive, regular) {
    return conjugator.merge(conjugator.base(infinitive, regular), '겠습니다');
};
conjugations.suppositive_formal_high.conjugation = true;
conjugations.suppositive_formal_high.type = 'suppositive';
conjugations.suppositive_formal_high.tense = 'none';
conjugations.suppositive_formal_high.speechLevel = 'formal high';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}