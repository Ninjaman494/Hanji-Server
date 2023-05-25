import { firstThirdMap, isVowel, thirdFirstMap } from './utils';
import * as hangeul from 'korean/hangeul';

/**
 * split word into letters
 * same logic after that
 * merge letters into words
 *
 * @param word
 * @returns an array of strings, with one letter removed in each word
 */
export const deleteJamo = (word: string) => {
  const deleteWords: string[] = [];

  const spread = hangeul.spread(word);
  if (spread.length <= 2) return [];

  // Delete a letter
  const deleteSpreads: string[] = [];
  for (let i = 2; i < spread.length; i++) {
    deleteSpreads.push(spread.slice(0, i) + spread.slice(i + 1));
  }

  // Join letters back into jamo
  deleteSpreads.forEach((s) => {
    let deletedWord = '';

    for (let i = 0; i < s.length; i += 2) {
      let padchim = undefined;
      if (i + 2 < s.length) {
        padchim = isVowel(s[i + 2]) ? s[i + 2] : undefined;
        padchim = firstThirdMap[padchim] ?? padchim;
      }

      const lead = thirdFirstMap[s[i]] ?? s[i];

      const x = hangeul.join(lead, s[i + 1], padchim);

      // TODO: improve behavior here
      if (hangeul.is_hangeul(x)) deletedWord += x;
    }

    deleteWords.push(deletedWord);
  });

  return deleteWords;
};
