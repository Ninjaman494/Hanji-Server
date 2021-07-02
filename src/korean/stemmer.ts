// (C) 2010 Dan Bravender - licensed under the AGPL 3.0
// (C) 2021 Akash Eldo - Converted to TypeScript
import * as hangeul from './hangeul';
import * as conjugator from './conjugator';

export const iterate_chop_last = (s: string): string[] => {
  const possibles = [];
  for (var i = s.length - 1; i > 0; i--) {
    possibles.push(s.substring(0, s.length - i));
  }
  possibles.push(s);
  return possibles;
};

export const generate_stems = (verb: string): string[] => {
  const possibles = [];
  if (verb[verb.length - 1] == '해') {
    possibles.push([false, verb.substring(0, verb.length - 1) + '하']);
  }
  if (hangeul.vowel(verb[verb.length - 1]) == 'ㅕ') {
    possibles.push([
      false,
      verb.substring(0, verb.length - 1) +
        hangeul.join(hangeul.lead(verb[verb.length - 1]), 'ㅣ'),
    ]);
  }
  if (hangeul.vowel(verb[verb.length - 1]) == 'ㅐ') {
    possibles.push([
      false,
      verb.substring(0, verb.length - 1) +
        hangeul.join(
          hangeul.lead(verb[verb.length - 1]),
          hangeul.vowel(
            hangeul.find_vowel_to_append(verb.substring(0, verb.length - 1)),
          ),
          'ᇂ',
        ),
    ]);
  }

  // Removing added ㅏ and ㅓ
  if (hangeul.vowel(verb[verb.length - 1]) == 'ㅘ') {
    possibles.push([
      false,
      verb.substring(0, verb.length - 1) +
        hangeul.join(hangeul.lead(verb[verb.length - 1]), 'ㅗ'),
    ]);
  }
  if (hangeul.vowel(verb[verb.length - 1]) == 'ㅝ') {
    possibles.push([
      false,
      verb.substring(0, verb.length - 1) +
        hangeul.join(hangeul.lead(verb[verb.length - 1]), 'ㅜ'),
    ]);
  }
  // ㅚ + 어
  if (hangeul.vowel(verb[verb.length - 1]) == 'ㅙ') {
    possibles.push([
      false,
      verb.substring(0, verb.length - 1) +
        hangeul.join(hangeul.lead(verb[verb.length - 1]), 'ㅚ'),
    ]);
  }
  // 르 irregular, create a joined stem to handle past tense
  const lead = hangeul.lead(verb[verb.length - 1]);
  const vowel = hangeul.vowel(verb[verb.length - 1]);
  const joined = hangeul.join(lead, vowel);

  if (
    (joined === '라' || joined === '러') &&
    hangeul.padchim(verb[verb.length - 2]) === 'ᆯ'
  ) {
    let char = verb[verb.length - 2];
    char = hangeul.join(hangeul.lead(char), hangeul.vowel(char));
    possibles.push([false, verb.substring(0, verb.length - 2) + char + '르']);
  }

  possibles.push([
    false,
    verb.substring(0, verb.length - 1) +
      hangeul.join(hangeul.lead(verb[verb.length - 1]), 'ㅡ'),
  ]);
  possibles.push([true, verb]);
  // try adding back in irregular disappearing padchims, use jamo from
  // unicode block U+11Ax and U+11Bx
  ['ᆮ', 'ᆸ', 'ᆯ', 'ᆺ', 'ᄂ', 'ᇂ'].forEach(function (padchim) {
    possibles.push([
      false,
      verb.substring(0, verb.length - 1) +
        hangeul.join(
          hangeul.lead(verb[verb.length - 1]),
          hangeul.vowel(verb[verb.length - 1]),
          padchim,
        ),
    ]);
  });
  // remove padchim entirely
  possibles.push([
    false,
    verb.substring(0, verb.length - 1) +
      hangeul.join(
        hangeul.lead(verb[verb.length - 1]),
        hangeul.vowel(verb[verb.length - 1]),
      ),
  ]);
  return possibles;
};

export const stem = (verb: string): Set<string> => {
  // remove all conjugators that return what was passed in
  var ignored_conjugations = {};
  var returnList = new Set<string>();
  var possConjugations = [];
  for (var f in conjugator) {
    if (conjugator[f].conjugation && conjugator[f]('test') == 'test') {
      ignored_conjugations[f] = true;
    }
  }
  var possible_stems = iterate_chop_last(verb);
  for (var i in possible_stems) {
    var possible_base_stem = possible_stems[i];
    var generated_stems = generate_stems(possible_base_stem);
    for (var j in generated_stems) {
      const original = generated_stems[j][0];
      const possible_stem = generated_stems[j][1];
      for (var f in conjugator) {
        if (
          !conjugator[f].conjugation ||
          (f in ignored_conjugations && original)
        ) {
          continue;
        }
        if (
          conjugator[f](possible_stem, true) == verb ||
          conjugator[f](possible_stem, false) == verb
        ) {
          // need one for reg and one for irreg
          var infin = { key: possible_stem + '다' };
          if (
            possConjugations.indexOf(infin.key) == -1 &&
            infin.key.indexOf(' ') == -1
          ) {
            returnList.add(infin.key);
            possConjugations.push(infin.key);
          }
        }
      }
    }
  }
  return returnList;
};

export const stem_lookup = (
  phrase: string,
  select_by_stem: any,
  callback: (order: string[], results: {}) => void,
) => {
  var spread_phrase = hangeul.spread(phrase);
  var order = [];
  var results = {};
  var called = 0;
  function add_results(new_results) {
    for (var i = 0; i < new_results.length; i++) {
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
  for (var i = spread_phrase.length; i >= 0; i--) {
    select_by_stem.all(spread_phrase.substr(0, i), function (err, rows) {
      add_results(
        rows.map(function (r) {
          return [r.infinitive, r.definition];
        }),
      );
    });
  }
};

export const base_forms = (infinitive: string): string[] => {
  var base_forms = [];

  [
    conjugator.base,
    conjugator.base2,
    conjugator.base3,
    conjugator.declarative_present_informal_low,
    function (infinitive, regular) {
      var original_infinitive = infinitive;
      infinitive = infinitive.substr(0, infinitive.length - 1);
      if (!regular) {
        return conjugator.drop_l(infinitive, '');
      }
      return infinitive;
    },
    function (infinitive, regular) {
      var conjugated = conjugator.declarative_present_informal_high(
        infinitive,
        regular,
      );
      return conjugated.substr(0, conjugated.length - 1);
    },
  ].forEach(function (base) {
    [true, false].forEach(function (regular) {
      // Need to cast to String here because some
      // irregulars are Geulja (see hangeul.js)
      const base_form = String(base(infinitive, regular));
      if (
        base_form &&
        base_forms.indexOf(base_form) == -1 &&
        base_forms.indexOf(base_form.substr(0, base_form.length - 1)) == -1
      ) {
        base_forms.push(base_form);
      }
    });
  });

  return base_forms;
};
