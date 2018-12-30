const conjugator = require('../conjugator');
let conjugations = {};

conjugator.determiner_present = function(infinitive, regular, isAdj) {
    let stem = conjugator.base3(infinitive, regular);
    if(stem.charAt(stem.length-1) == '있' || stem.charAt(stem.length-1) == '없' || !isAdj){ // special conjugations for these forms
        return stem + '는';
    }else {
        return conjugator.merge(stem, '은');
    }
};
conjugator.determiner_present.conjugation = true;
conjugator.determiner_present.type = 'determiner';
conjugator.determiner_present.tense = 'present';
conjugator.determiner_present.speechLevel = 'none';

// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}