import { deleteJamo, replaceJamo, insertJamo } from './edits';

export const editOneLetter = (word: string) => {
  const wordSet = new Set<string>();

  deleteJamo(word).forEach((w) => wordSet.add(w));
  replaceJamo(word).forEach((w) => wordSet.add(w));
  insertJamo(word).forEach((w) => wordSet.add(w));
  // switchJamo(word).forEach((w) => wordSet.add(w));

  wordSet.delete(word);

  return wordSet;
};

const editTwoLetter = (word: string) => {
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

const getCorrections = (
  word: string,
  probs: Record<string, number>,
  vocab: Record<string, number>,
) => {
  if (vocab[word]) return [word];

  let suggestions = Array.from(editOneLetter(word)).filter((w) => vocab[w]);
  if (suggestions.length == 0) {
    suggestions = Array.from(editTwoLetter(word)).filter((w) => vocab[w]);
  }

  const suggestionProb: Record<string, number> = {};
  suggestions.forEach((s) => (suggestionProb[s] = probs[s]));

  const best = Object.keys(suggestionProb).sort(
    (a, b) => suggestionProb[b] - suggestionProb[a],
  );

  return best.slice(0, 3);
};
