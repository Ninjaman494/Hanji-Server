const conjugator = require('../conjugator');
let conjugations = {};

conjugations.determiner_present = function(infinitive, regular, isAdj) {
    let stem = conjugator.base(infinitive, regular);
    if(stem.charAt(stem.length-1) == '있' || stem.charAt(stem.length-1) == '없' || !isAdj){ // special conjugations for these forms
        //conjugator.reasons.push(`join (${stem} + 는 -> ${stem + '는'})`);
        return conjugator.join(stem, '는');
    }else {
        return conjugator.merge(conjugator.base3(infinitive,regular), '은');
    }
};
conjugations.determiner_present.conjugation = true;
conjugations.determiner_present.type = 'determiner';
conjugations.determiner_present.tense = 'present';
conjugations.determiner_present.speechLevel = 'none';

conjugations.determiner_past = function(infinitive, regular, isAdj) {
    let stem = conjugator.base(infinitive, regular);
    if(!isAdj && stem.charAt(stem.length-1) != '있' && stem.charAt(stem.length-1) != '없') {
        return conjugator.merge(conjugator.base3(infinitive, regular), '은');
    }
};
conjugations.determiner_past.conjugation = true;
conjugations.determiner_past.type = 'determiner';
conjugations.determiner_past.tense = 'past';
conjugations.determiner_past.speechLevel = 'none';

conjugations.determiner_future = function(infinitive, regular, isAdj) {
    //let stem = conjugator.base(infinitive, regular);
    //if(!isAdj && stem.charAt(stem.length-1) != '있' && stem.charAt(stem.length-1) != '없') {
    return conjugator.merge(conjugator.base3(infinitive, regular), '을');
    //}
};
conjugations.determiner_future.conjugation = true;
conjugations.determiner_future.type = 'determiner';
conjugations.determiner_future.tense = 'future';
conjugations.determiner_future.speechLevel = 'none';


// export conjugations
for(let conjugation in conjugations){
    exports[conjugation] = conjugations[conjugation];
}