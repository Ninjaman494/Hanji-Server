// vim: set ts=4 sw=4 expandtab
// (C) 2010 Dan Bravender - licensed under the AGPL 3.0
// (C) 2021 Akash Eldo - Converted to TypeScript
import * as hangeul from './hangeul';

export const padchim_to_lead = {
  ᆨ: 'ᄀ',
  ᆩ: 'ᄁ',
  ᆫ: 'ᄂ',
  ᆮ: 'ᄃ',
  ᆯ: 'ᄅ',
  ᆷ: 'ᄆ',
  ᆸ: 'ᄇ',
  ᆺ: 'ᄉ',
  ᆻ: 'ᄊ',
  ᆼ: 'ᄋ',
  ᆽ: 'ᄌ',
  ᆾ: 'ᄎ',
  ᆿ: 'ᄏ',
  ᇀ: 'ᄐ',
  ᇁ: 'ᄑ',
  ᇂ: 'ᄒ',
};

export const move_padchim_to_replace_eung = (
  x: string,
  y: string,
): string[] | void => {
  if (hangeul.padchim(x[x.length - 1]) == 'ᆼ') {
    return;
  }
  if (
    (hangeul.padchim(x[x.length - 1]) as string) in padchim_to_lead &&
    hangeul.lead(y[0]) == 'ᄋ'
  ) {
    return [
      x.substring(0, x.length - 1) +
        hangeul.join(
          hangeul.lead(x[x.length - 1]),
          hangeul.vowel(x[x.length - 1]),
        ),
      hangeul.join(
        padchim_to_lead[hangeul.padchim(x[x.length - 1]) as string],
        hangeul.vowel(y[0]),
        hangeul.padchim(y[0]) as string,
      ) + y.substring(1),
    ];
  }
};

export const change_padchim_pronunciation = (
  to: string,
  changers: { [key: string]: boolean },
): ((x: string, y: string) => string[]) => {
  return function (x, y) {
    if ((hangeul.padchim(x[x.length - 1]) as string) in changers) {
      return [
        x.substring(0, x.length - 1) +
          hangeul.join(
            hangeul.lead(x[x.length - 1]),
            hangeul.vowel(x[x.length - 1]),
            to,
          ),
        y,
      ];
    }
  };
};

export const consonant_combination_rule = (
  x_padchim: string,
  y_lead: string,
  new_padchim: string,
  new_lead: string,
  y_vowel?: string,
): ((x: string, y: string) => string[]) => {
  return function (x, y) {
    if (y_vowel && hangeul.vowel(y[0]) != y_vowel) {
      return;
    }
    if (
      (hangeul.padchim(x[x.length - 1]) == x_padchim || x_padchim == '*') &&
      (hangeul.lead(y[0]) == y_lead || y_lead == '*')
    ) {
      return [
        x.substring(0, x.length - 1) +
          hangeul.join(
            hangeul.lead(x[x.length - 1]),
            hangeul.vowel(x[x.length - 1]),
            new_padchim == '*'
              ? (hangeul.padchim(x[-1]) as string)
              : new_padchim,
          ),
        hangeul.join(
          new_lead == '*' ? hangeul.lead(y[0]) : new_lead,
          hangeul.vowel(y[0]),
          hangeul.padchim(y[0]) as string,
        ) + y.substring(1),
      ];
    }
  };
};

export const skip_non_hangeul = (
  x: string,
  y: string,
): [string, string, true] | void => {
  if (!hangeul.is_hangeul(x[x.length - 1])) {
    return [x, y, true];
  }
};

export const merge_rules = [
  /* WARNING: Please be careful when adding/modifying rules since padchim 
            hangeul.and lead characters are different Unicode characters. Please see:
            http://www.kfunigraz.ac.at/~katzer/korean_hangul_unicode.html

   Rules from http://en.wikibooks.org/wiki/Korean/Advanced_Pronunciation_Rules
*/
  skip_non_hangeul,
  consonant_combination_rule('ᇂ', 'ᄋ', null, 'ᄋ', null),
  // ㄱㄴ becomes ㅇㄴ
  consonant_combination_rule('ᆨ', 'ᄂ', 'ᆼ', 'ᄂ', null),
  // ㄱㅁ becomes ㅇㅁ
  consonant_combination_rule('ᆨ', 'ᄆ', 'ᆼ', 'ᄆ', null),
  // ㅋㄴ becomes ㅇㄴ
  consonant_combination_rule('ᆿ', 'ᄂ', 'ᆼ', 'ᄂ', null),
  // ㅋㅁ becomes ㅇㅁ
  consonant_combination_rule('ᆿ', 'ᄆ', 'ᆼ', 'ᄆ', null),
  // ㄷㄴ becomes ㄴㄴ
  consonant_combination_rule('ᆮ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  // ㄷㅁ becomes ㄴㅁ
  consonant_combination_rule('ᆮ', 'ᄆ', 'ᆫ', 'ᄆ', null),
  // ㅅㄴ becomes ㄴㄴ
  consonant_combination_rule('ᆺ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  // ㅆㄴ becomes ㄴㄴ
  consonant_combination_rule('ᆻ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  // ㅅㅁ becomes ㄴㅁ
  consonant_combination_rule('ᆺ', 'ᄆ', 'ᆫ', 'ᄆ', null),
  // ㄱ ㅆ becomes ㄱ ㅆ
  consonant_combination_rule('ᆨ', 'ᄉ', 'ᆨ', 'ᄊ', null),
  // ㅈㄴ becomes ㄴㄴ
  consonant_combination_rule('ᆽ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  // ㅈㅁ becomes ㄴㅁ
  consonant_combination_rule('ᆽ', 'ᄆ', 'ᆫ', 'ᄆ', null),
  // ㅊㄴ becomes ㄴㄴ
  consonant_combination_rule('ᆾ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  // ㅊㅁ becomes ㄴㅁ
  consonant_combination_rule('ᆾ', 'ᄆ', 'ᆫ', 'ᄆ', null),
  // ㅌㄴ becomes ㄴㄴ
  consonant_combination_rule('ᇀ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  // ㅌㅁ becomes ㄴㅁ
  consonant_combination_rule('ᇀ', 'ᄆ', 'ᆫ', 'ᄆ', null),
  //  ㅎㄴ becomes ㄴㄴ
  consonant_combination_rule('ᇂ', 'ᄂ', 'ᆫ', 'ᄂ', null),
  //  ㅎㅁ becomes ㄴㅁ
  consonant_combination_rule('ᇂ', 'ᄆ', 'ᆫ', 'ᄆ', null),
  //  ㅂㄴ becomes ㅁㄴ
  consonant_combination_rule('ᆸ', 'ᄂ', 'ᆷ', 'ᄂ', null),
  // ㅂㅁ becomes ㅁㅁ
  consonant_combination_rule('ᆸ', 'ᄆ', 'ᆷ', 'ᄆ', null),
  // ㅍㄴ becomes ㅁㄴ
  consonant_combination_rule('ᇁ', 'ᄂ', 'ᆷ', 'ᄂ', null),
  // ㅍㅁ becomes ㅁㅁ
  consonant_combination_rule('ᇁ', 'ᄆ', 'ᆷ', 'ᄆ', null),
  //  ㄱㅎ becomes ㅋ
  consonant_combination_rule('ᆨ', 'ᄒ', null, 'ᄏ', null),
  //  ㅎㄱ becomes ㅋ
  consonant_combination_rule('ᇂ', 'ᄀ', null, 'ᄏ', null),
  // ㅎㄷ becomes ㅌ
  consonant_combination_rule('ᇂ', 'ᄃ', null, 'ᄐ', null),
  // ㄷㅎ becomes ㅌ
  consonant_combination_rule('ᆮ', 'ᄒ', null, 'ᄐ', null),
  // ㅂㅎ becomes ㅍ
  consonant_combination_rule('ᆸ', 'ᄒ', null, 'ᄑ', null),
  // ㅎㅂ becomes ㅍ
  consonant_combination_rule('ᇂ', 'ᄇ', null, 'ᄑ', null),
  // ㅈㅎ becomes ㅊ
  consonant_combination_rule('ᆽ', 'ᄒ', null, 'ᄎ', null),
  // ㅎㅈ becomes ㅊ
  consonant_combination_rule('ᇂ', 'ᄌ', null, 'ᄎ', null),
  // ㅎㅅ becomes ㅆ
  consonant_combination_rule('ᇂ', 'ᄉ', null, 'ᄊ', null),
  //ㄷ이 becomes 지
  consonant_combination_rule('ᆮ', 'ᄋ', null, 'ᄌ', 'ㅣ'),
  //ㅌ이 becomes 치
  consonant_combination_rule('ᇀ', 'ᄋ', null, 'ᄎ', 'ㅣ'),
  //ㄱㄹ becomes ㅇㄴ
  consonant_combination_rule('ᆨ', 'ᄅ', 'ᆼ', 'ᄂ', null),
  //ㄴㄹ becomes ㄹㄹ // TODO: (not sure how to fix pronunciation) also sometimes ㄴㄴ
  consonant_combination_rule('ᆫ', 'ᄅ', 'ᆯ', 'ᄅ', null),
  // ㅁㄹ becomes ㅁㄴ
  consonant_combination_rule('ᆷ', 'ᄅ', 'ᆷ', 'ᄂ', null),
  // ㅇㄹ becomes ㅇㄴ
  consonant_combination_rule('ᆼ', 'ᄅ', 'ᆼ', 'ᄂ', null),
  // ㅂㄹ becomes ㅁㄴ
  consonant_combination_rule('ᆸ', 'ᄅ', 'ᆷ', 'ᄂ', null),
  // ㅅ ㅎ becomes ㅌ
  consonant_combination_rule('ᆺ', 'ᄒ', null, 'ᄐ', null),
  // 받침 followed by ㅇ: replace ㅇ with 받침 (use second 받침 if there are two). Otherwise, 받침 followed by consonant:
  move_padchim_to_replace_eung,
  //    * ㄱ, ㅋ: like ㄱ
  //    * ㄷ, ㅅ, ㅈ, ㅊ, ㅌ, ㅎ: like ㄷ
  //    * ㅂ, ㅍ: like ㅂ
  // Double padchim rules
  consonant_combination_rule('ᆱ', 'ᄋ', 'ᆯ', 'ᄆ', null),
  consonant_combination_rule('ᆹ', 'ᄋ', 'ᆸ', 'ᄉ', null),
  consonant_combination_rule('ᆱ', '*', 'ᆷ', '*', null),
  consonant_combination_rule('ᆶ', 'ᄋ', null, 'ᄅ', null),
  consonant_combination_rule('ᆶ', '*', 'ᆯ', '*', null),
  consonant_combination_rule('ᆬ', 'ᄋ', 'ᆫ', 'ᄌ', null),
  consonant_combination_rule('ᆬ', '*', 'ᆫ', '*', null),
  // 학교 -> 학꾜
  consonant_combination_rule('ᆨ', 'ᄀ', 'ᆨ', 'ᄁ', null),
  // 밥솥-> 밥쏟
  consonant_combination_rule('ᆸ', 'ᄉ', 'ᆸ', 'ᄊ', null),
  // 있습니다 -> 이씀니다
  consonant_combination_rule('ᆻ', 'ᄉ', null, 'ᄊ', null),
  change_padchim_pronunciation('ᆮ', {
    ᆺ: true,
    ᆻ: true,
    ᆽ: true,
    ᆾ: true,
    ᇀ: true,
    ᇂ: true,
  }),
  change_padchim_pronunciation('ᆸ', { ᇁ: true }),
  consonant_combination_rule('ᆮ', 'ᄃ', null, 'ᄄ'),
  function (x, y) {
    return [x, y];
  },
];

export const apply_rules = (x: string, y: string): string => {
  let result = null;
  merge_rules.forEach(function (rule) {
    const merge = rule(x, y);
    if (merge && merge.length == 3) {
      x = merge[0];
      y = merge[1];
      const stop = merge[2];
      if (stop) {
        result = x + y;
      }
    } else if (merge) {
      x = merge[0];
      y = merge[1];
    }
  });
  if (result) {
    return result;
  }
  return x + y;
};

export const get_pronunciation = (word: string): string => {
  return (word + String.fromCharCode(0))
    .split('')
    .reduce(apply_rules)
    .substring(0, word.length);
};
