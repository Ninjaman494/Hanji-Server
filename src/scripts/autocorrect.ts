/**
 * Autocorrect for Korean using minimum edit distance
 *
 * get corpus
 * convert corpus in word:prob dictionary
 * create functions for delete, switch, replace, and insert operations
 * Use utilitiy functions to look for words 1 edit distance away
 * "" for words 2 edit distance away
 * Combine both edit distance functions into a main autocorrect function
 */

import fs from 'fs';
import { dropWhile } from 'lodash';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

// Create dictionary
const corpusWords = fs
  .readFileSync('./shakespeare.txt')
  .toString()
  .toLowerCase()
  .match(/\b(\w+)\b/g);

const vocab: Record<string, number> = {};
corpusWords.forEach((w) => (vocab[w] = vocab[w] ? vocab[w] + 1 : 1));

// Create probablities
const vocabSize = Object.values(vocab).reduce((prev, curr) => prev + curr);
const probs: Record<string, number> = {};
Object.keys(vocab).forEach((v) => (probs[v] = vocab[v] / vocabSize));

const deleteJamo = (word: string) => {
  const deleteWords: string[] = [];
  for (let i = 0; i < word.length; i++) {
    deleteWords.push(word.slice(0, i) + word.slice(i + 1));
  }
  return deleteWords;
};

/** Switches adjacent jamo only */
const switchJamo = (word: string) => {
  const switchWords: string[] = [];
  for (let i = 1; i < word.length; i++) {
    const a = word[i - 1];
    const b = word[i];

    switchWords.push(word.slice(0, i - 1) + b + a + word.slice(i + 1));
  }
  return switchWords;
};

const replaceJamo = (word: string) => {
  const replaceWords = new Set<string>();
  for (let i = 0; i < word.length; i++) {
    alphabet
      .split('')
      .forEach((a) =>
        replaceWords.add(word.slice(0, i) + a + word.slice(i + 1)),
      );
  }
  return Array.from<string>(replaceWords);
};

const insertJamo = (word: string) => {
  const insertWords = new Set<string>();
  for (let i = 0; i <= word.length; i++) {
    alphabet
      .split('')
      .forEach((a) => insertWords.add(word.slice(0, i) + a + word.slice(i)));
  }
  return Array.from<string>(insertWords);
};

const editOneLetter = (word: string) => {
  const wordSet = new Set<string>();

  deleteJamo(word).forEach((w) => wordSet.add(w));
  replaceJamo(word).forEach((w) => wordSet.add(w));
  insertJamo(word).forEach((w) => wordSet.add(w));
  switchJamo(word).forEach((w) => wordSet.add(w));

  wordSet.delete(word);

  return Array.from(wordSet);
};

const editTwoLetter = (word: string) => {
  const wordSet = new Set<string>();
  const editOneSet = editOneLetter(word);

  editOneSet.forEach((edit) => {
    deleteJamo(edit).forEach((w) => wordSet.add(w));
    replaceJamo(edit).forEach((w) => wordSet.add(w));
    insertJamo(edit).forEach((w) => wordSet.add(w));
    switchJamo(edit).forEach((w) => wordSet.add(w));
  });

  wordSet.delete(word);

  return Array.from(wordSet);
};

const getCorrections = (
  word: string,
  probs: Record<string, number>,
  vocab: Record<string, number>,
) => {
  if (vocab[word]) return [word];

  let suggestions = editOneLetter(word).filter((w) => vocab[w]);
  if (suggestions.length == 0) {
    suggestions = editTwoLetter(word).filter((w) => vocab[w]);
  }

  const suggestionProb: Record<string, number> = {};
  suggestions.forEach((s) => (suggestionProb[s] = probs[s]));

  const best = Object.keys(suggestionProb).sort(
    (a, b) => suggestionProb[b] - suggestionProb[a],
  );

  return best.slice(0, 3);
};

const word = 'dys';
const corrections = getCorrections(word, probs, vocab);
console.log(corrections);
console.log(probs[corrections[0]]);
