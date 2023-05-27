import { readFileSync } from 'fs';
import { normalizeJamo } from './utils';

// match hangul in front of first tab and numbers at end of line
// skip any non hangul characters in the beginning of the line
const re = /[^\u3131-\uD79D]*([\u3131-\uD79D]*).*\t.*\t(\d*)$/m;

export const generateDict = (filepath: string) => {
  const fileData = readFileSync(filepath);

  const data = fileData
    .toString()
    .split('\n')
    .map((l) => l.trim().match(re).slice(1, 3));

  return data.reduce((prev, curr) => {
    const [word, count] = curr;
    if (!word) return prev;

    const key = Array.from(word.normalize('NFD')).map(normalizeJamo).join('');
    const totalCount = parseInt(count) + (prev.has(key) ? prev.get(key)[0] : 0);
    prev.set(key, [totalCount, word]);
    return prev;
  }, new Map<string, [number, string]>());
};

export const readDict = () => {
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
