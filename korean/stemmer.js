// vim: set ts=4 sw=4 expandtab
// (C) 2010 Dan Bravender - licensed under the AGPL 3.0

try {
    var hangeul    = require('./hangeul'),
        conjugator = require('./conjugator');
} catch(e) {}

var stemmer = {};

stemmer.iterate_chop_last = function(s) {
    possibles = [];
    for (var i=s.length-1; i > 0; i--) {
        possibles.push(s.substring(0, s.length-i));
    }
    possibles.push(s);
    return possibles;
};

stemmer.generate_stems = function(verb) {
    possibles = [];
    if (verb[verb.length-1] == '해') {
        possibles.push([false, verb.substring(0, verb.length-1) + '하']);
    }
    if (hangeul.vowel(verb[verb.length-1]) == 'ㅕ') {
        possibles.push([false, verb.substring(0, verb.length-1) +
                               hangeul.join(hangeul.lead(verb[verb.length-1]), 'ㅣ')]);
    }
    if (hangeul.vowel(verb[verb.length-1]) == 'ㅐ') {
        possibles.push([false, verb.substring(0, verb.length-1) +
                      hangeul.join(hangeul.lead(verb[verb.length-1]),
                                   hangeul.vowel(hangeul.find_vowel_to_append(verb.substring(0, verb.length-1))),
                                   'ᇂ')]);
    }
    possibles.push([false, verb.substring(0, verb.length-1) +
                           hangeul.join(hangeul.lead(verb[verb.length-1]), 'ㅡ')]);
    possibles.push([true, verb]);
    // try adding back in irregular disappearing padchims
    ['ᆮ', 'ᆸ','ᆯ', 'ᆺ', 'ᄂ'].forEach(function(padchim) {
        possibles.push([false, verb.substring(0, verb.length-1) +
                                hangeul.join(hangeul.lead(verb[verb.length-1]),
                                             hangeul.vowel(verb[verb.length-1]), padchim)]);
    });
    // remove padchim entirely
    possibles.push([false, verb.substring(0, verb.length-1) +
                           hangeul.join(hangeul.lead(verb[verb.length-1]),
                                        hangeul.vowel(verb[verb.length-1]))]);
    return possibles;
};

stemmer.stem = function(verb) {
    // remove all conjugators that return what was passed in
    var ignored_conjugations = {};
    for (var f in conjugator) {
        if (conjugator[f].conjugation && conjugator[f]('test') == 'test') {
            ignored_conjugations[f] = true;
        }
    }
    var possible_stems = stemmer.iterate_chop_last(verb);
    for (var i in possible_stems) {
        var possible_base_stem = possible_stems[i];
        var generated_stems = stemmer.generate_stems(possible_base_stem);
        for (var j in generated_stems) {
            original = generated_stems[j][0];
            possible_stem = generated_stems[j][1];
            for (var f in conjugator) {
                if (!conjugator[f].conjugation || (f in ignored_conjugations && original)) {
                    continue;
                }
                if (conjugator[f](possible_stem) == verb) {  // This line causes 듣다 bug, solution is to return multiple verbs.
                    return possible_stem + '다';
                }
            }
        }
    }
};

stemmer.stem_lookup = function(phrase, select_by_stem, callback) {
    var spread_phrase = hangeul.spread(phrase);
    var order = [];
    var results = {};
    var called = 0;
    function add_results(new_results) {
        for (var i=0; i<new_results.length; i++) {
            var infinitive = new_results[i][0];
            var definition = new_results[i][1];
            if (order.indexOf(infinitive) == -1) {
                order.push(infinitive);
            }
            if (!(infinitive in results)) {
                results[infinitive] = [];
            }
            if (results[infinitive].indexOf(definition) == -1) {
                results[infinitive].push(definition);
            }
        }
        called++;
        if (called == spread_phrase.length) {
            return callback(order, results);
        }
    }
    for (var i=spread_phrase.length; i>=0; i--) {
        select_by_stem.all(spread_phrase.substr(0, i), function(err, rows) {
            add_results(rows.map(function(r) {
                return [r.infinitive, r.definition];
            }));
        });
    }
};

stemmer.base_forms = function(infinitive) {
    var base_forms = [];

    [
        conjugator.base,
        conjugator.base2,
        conjugator.base3,
        conjugator.declarative_present_informal_low,
        function(infinitive, regular) {
            var original_infinitive = infinitive;
            infinitive = infinitive.substr(0, infinitive.length-1);
            if (!regular) {
                return conjugator.drop_l(infinitive, '');
            }
            return infinitive;
        },
        function(infinitive, regular) {
            var conjugated = conjugator.declarative_present_informal_high(
                infinitive,
                regular
            );
            return conjugated.substr(0, conjugated.length-1);
        }
    ].forEach(function(base) {
        [true, false].forEach(function(regular) {
            // Need to cast to String here because some
            // irregulars are Geulja (see hangeul.js)
            base_form = String(base(infinitive, regular));
            if (base_form &&
                base_forms.indexOf(base_form) == -1 &&
                base_forms.indexOf(base_form.substr(0, base_form.length-1)) == -1) {
                base_forms.push(base_form);
            }
        });
    });

    return base_forms;
}

// Export functions to node
try {
    for (f in stemmer) {
        exports[f] = stemmer[f];
    }
} catch(e) {}
