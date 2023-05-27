import { deleteJamo, replaceJamo, insertJamo } from './edits';
import { readFileSync } from 'fs';

let vocab: Map<string, [number, string]> | undefined;

export const editOneLetter = (word: string) => {
  const wordSet = new Set<string>();

  deleteJamo(word).forEach((w) => wordSet.add(w));
  replaceJamo(word).forEach((w) => wordSet.add(w));
  insertJamo(word).forEach((w) => wordSet.add(w));

  wordSet.delete(word);

  return wordSet;
};

export const editTwoLetter = (word: string) => {
  const wordSet = new Set<string>();
  const editOneSet = editOneLetter(word);

  editOneSet.forEach((edit) => {
    deleteJamo(edit).forEach((w) => wordSet.add(w));
    replaceJamo(edit).forEach((w) => wordSet.add(w));
    insertJamo(edit).forEach((w) => wordSet.add(w));
  });

  wordSet.delete(word);

  return wordSet;
};

export const findCorrection = (word: string) => {
  if (vocab[word]) return word;

  let suggestions = Array.from(editOneLetter(word)).filter((w) => vocab[w]);
  if (suggestions.length == 0) {
    suggestions = Array.from(editTwoLetter(word)).filter((w) => vocab[w]);
  }

  const suggestionProb: Record<string, number> = {};
  suggestions.forEach((s) => (suggestionProb[s] = vocab[s][0]));

  const best = Object.keys(suggestionProb).sort(
    (a, b) => suggestionProb[b] - suggestionProb[a],
  );

  return vocab[best[0]][1];
};

export const initAutoCorrectVocab = () => {
  if (!vocab) vocab = readDict();
};

const readDict = () => {
  const fileData = readFileSync('./dict.csv');

  const dictMap = fileData
    .toString()
    .split('\n')
    .reduce((prev, curr) => {
      if (!curr.trim()) return prev;

      const [key, count, word] = curr.trim().split(',');
      const totalCount = parseInt(count) + (prev.has(key) ? prev[key][0] : 0);
      prev[key] = [totalCount, word];

      return prev;
    }, new Map<string, [number, string]>());

  return dictMap;
};
