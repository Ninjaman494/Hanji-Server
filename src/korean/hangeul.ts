// (C) 2010 Dan Bravender - licensed under the AGPL 3.0
// (C) 2021 Akash Eldo - Converted to TypeScript

import { Geulja } from './geulja';

export { Geulja } from './geulja';

export const is_hangeul = (character: string): boolean => {
  if (
    character.charCodeAt(0) >= '가'.charCodeAt(0) &&
    character.charCodeAt(0) <= '힣'.charCodeAt(0)
  ) {
    return true;
  }
  return false;
};

export const is_hangeul_string = (string: string): boolean => {
  return (
    string
      // remove spaces and punctuation
      .replace(/[!"\?\. ]/g, '')
      .split('')
      .every(is_hangeul)
  );
};

// Equations lifted directly from:
// http://www.kfunigraz.ac.at/~katzer/korean_hangul_unicode.html
export const lead = (character: string): string => {
  return String.fromCharCode(
    Math.floor(character.charCodeAt(0) - 44032) / 588 + 4352,
  );
};

export const vowel = (character: string): string => {
  const padchim_character = padchim(character);
  let padchim_offset;
  if (!padchim_character || padchim_character == true) {
    padchim_offset = -1;
  } else {
    padchim_offset = padchim_character.charCodeAt(0) - 'ᆨ'.charCodeAt(0);
  }
  return String.fromCharCode(
    Math.floor(
      ((character.charCodeAt(0) - 44032 - padchim_offset) % 588) / 28,
    ) + 'ㅏ'.charCodeAt(0),
  );
};

export const padchim = (character: Geulja | string): string | boolean => {
  if ((character as Geulja).hidden_padchim) {
    return true;
  }
  if ((character as Geulja).original_padchim) {
    return (character as Geulja).original_padchim;
  }
  const p = String.fromCharCode(
    (((character as string).charCodeAt(0) - 44032) % 28) +
      'ᆨ'.charCodeAt(0) -
      1,
  );
  if (p.charCodeAt(0) == 4519) {
    return null;
  } else {
    return p;
  }
};

export const join = (lead: string, vowel: string, padchim?: string): string => {
  const lead_offset = lead.charCodeAt(0) - 'ᄀ'.charCodeAt(0);
  const vowel_offset = vowel.charCodeAt(0) - 'ㅏ'.charCodeAt(0);
  let padchim_offset;
  if (padchim) {
    padchim_offset = padchim.charCodeAt(0) - 'ᆨ'.charCodeAt(0);
  } else {
    padchim_offset = -1;
  }
  return String.fromCharCode(
    padchim_offset + vowel_offset * 28 + lead_offset * 588 + 44032 + 1,
  );
};

export const split = (geulja: string): (string | boolean)[] => {
  return [lead(geulja), vowel(geulja), padchim(geulja)];
};

export const spread = (string: string): string => {
  return string
    .split('')
    .map(split)
    .reduce(function (a, b) {
      return a.concat(b);
    })
    .join('');
};

export const find_vowel_to_append = (string: string): string => {
  let append = null;
  string
    .split('')
    .reverse()
    .forEach(function (character) {
      if (character in { 뜨: true, 쓰: true, 트: true }) {
        if (!append) append = '어';
      }
      if (vowel(character) == 'ㅡ' && !padchim(character)) {
        //continue
      } else if (vowel(character) in { ㅗ: true, ㅏ: true, ㅑ: true }) {
        if (!append) append = '아';
      } else {
        if (!append) append = '어';
      }
    });
  if (!append) append = '어';
  return append;
};

export const match = (
  character: string,
  l: string,
  v: string,
  p?: string,
): boolean => {
  return (
    (l == '*' || lead(character) == l) &&
    (v == '*' || vowel(character) == v) &&
    (p == '*' || padchim(character) == p)
  );
};
