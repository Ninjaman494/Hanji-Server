import { readFileSync } from 'fs';

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

    prev[word] = parseInt(count) + (prev[word] ?? 0);
    return prev;
  }, {});
};
