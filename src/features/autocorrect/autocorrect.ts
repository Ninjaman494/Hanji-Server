import breakDownWord from './breakDownWord';
import { deleteJamo, replaceJamo, insertJamo } from './edits';
import { createReadStream } from 'fs';

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

export const findCorrection = (word: string): string | null => {
  const brokenDownWord = breakDownWord(word);

  if (vocab[brokenDownWord]) return vocab[brokenDownWord][1];

  let suggestions = Array.from(editOneLetter(brokenDownWord)).filter(
    (w) => vocab[w],
  );
  if (suggestions.length == 0) {
    suggestions = Array.from(editTwoLetter(brokenDownWord)).filter(
      (w) => vocab[w],
    );
  }

  const suggestionProb: Record<string, number> = {};
  suggestions.forEach((s) => (suggestionProb[s] = vocab[s][0]));

  const best = Object.keys(suggestionProb).sort(
    (a, b) => suggestionProb[b] - suggestionProb[a],
  );

  return vocab[best[0]]?.[1] ?? null;
};

export const initAutoCorrectVocab = async () => {
  if (!vocab) vocab = await readDict();
};

const readDict = async () => {
  const stream = createReadStream('./dict.csv');

  const dictMap = new Map<string, [number, string]>();
  for await (const data of stream) {
    (data as string)
      .toString()
      .split('\n')
      .reduce((prev, curr) => {
        if (!curr.trim()) return prev;

        const [key, count, word] = curr.trim().split(',');
        const totalCount = parseInt(count) + (prev.has(key) ? prev[key][0] : 0);
        prev[key] = [totalCount, word];

        return prev;
      }, dictMap);
  }
  stream.destroy();

  return dictMap;
};
