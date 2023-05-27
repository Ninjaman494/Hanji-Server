import { deleteJamo, replaceJamo, insertJamo } from './edits';
import { readDict } from './generateDict';

let vocab: Map<string, [number, string]> | undefined;

export const editOneLetter = (word: string) => {
  const wordSet = new Set<string>();

  deleteJamo(word).forEach((w) => wordSet.add(w));
  replaceJamo(word).forEach((w) => wordSet.add(w));
  insertJamo(word).forEach((w) => wordSet.add(w));
  // switchJamo(word).forEach((w) => wordSet.add(w));

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
    // switchJamo(edit).forEach((w) => wordSet.add(w));
  });

  wordSet.delete(word);

  return wordSet;
};

export const findCorrection = (
  word: string,
  vocab: Map<string, [number, string]>,
) => {
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

export const getVocab = () => {
  if (!vocab) vocab = readDict();
  return vocab;
};
