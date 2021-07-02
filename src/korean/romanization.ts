// (C) 2010 Dan Bravender - licensed under the AGPL 3.0
// (C) 2021 Akash Eldo - Converted to TypeScript
import * as pronunciation from './pronunciation';
import * as hangeul from './hangeul';

export const transliteration = {
  ㅏ: 'ah',
  ㅑ: 'yah',
  ㅓ: 'uh',
  ㅕ: 'yuh',
  ㅗ: 'oh',
  ㅛ: 'yoh',
  ㅜ: 'oo',
  ㅠ: 'yoo',
  ㅡ: 'eu',
  ㅣ: 'ee',
  ㅐ: 'ae',
  ㅒ: 'yae',
  ㅔ: 'ae',
  ㅖ: 'yae',
  ㅘ: 'wah',
  ㅙ: 'wae',
  ㅚ: 'wae',
  ㅝ: 'wuh',
  ㅞ: 'weh',
  ㅟ: 'wee',
  ㅢ: 'ui',
  ᄀ: ['g', 'g'],
  ᄂ: ['n', 'n'],
  ᄃ: ['d', 't'],
  ᄅ: ['r', 'l'],
  ᄆ: ['m', 'm'],
  ᄇ: ['b', 'p'],
  ᄉ: ['s', 's'],
  ᄋ: ['', 'ng'],
  ᄌ: ['ch', 't'],
  ᄎ: ['ch', 't'],
  ᄏ: ['k', 'k'],
  ᄐ: ['t', 't'],
  ᄑ: ['p', 'p'],
  ᄒ: ['h', 't'],
  ᄁ: ['gg', 'gg'],
  ᄄ: ['tt', 'tt'],
  ᄈ: ['bb', 'bb'],
  ᄊ: ['ss', 'ss'],
  ᄍ: ['jj', 'jj'],
  // The pronunciation engine should remove most of these
  // these are here in the off chance that they make it through
  ᆭ: ['', 'n'],
  ᆬ: ['', 'n'],
  ᆪ: ['', 'g'],
  ᆰ: ['', 'l'],
  ᆱ: ['', 'l'],
  ᆲ: ['', 'l'],
  ᆳ: ['', 'l'],
  ᆴ: ['', 'l'],
  ᆵ: ['', 'l'],
  ᆶ: ['', 'l'],
  ᆹ: ['', 'p'],
};

export const romanize_character = (character: string): string => {
  if (!hangeul.is_hangeul(character)) {
    return character;
  }
  const lead = hangeul.lead(character);
  const vowel = hangeul.vowel(character);
  const padchim = hangeul.padchim(character) as string;
  const lead_transliteration = transliteration[lead][0];
  const vowel_transliteration = transliteration[vowel];
  if (padchim in transliteration) {
    var padchim_transliteration = transliteration[padchim][1];
  } else {
    try {
      var padchim_transliteration =
        transliteration[pronunciation.padchim_to_lead[padchim]][1];
    } catch (e) {
      var padchim_transliteration = '';
    }
  }
  // What would a language be without irregulars?
  if (
    lead in { ᄉ: true, ᄊ: true } &&
    vowel in { ㅑ: true, ㅣ: true, ㅛ: true, ㅠ: true }
  ) {
    return 'sh' + vowel_transliteration + padchim_transliteration;
  }
  return lead_transliteration + vowel_transliteration + padchim_transliteration;
};

export const romanize = (word: string): string => {
  const pronunciation_of_word = pronunciation.get_pronunciation(word);
  return pronunciation_of_word.split('').map(romanize_character).join('-');
};
