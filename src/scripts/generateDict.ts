import { breakDownWord } from '../features/autocorrect/utils';

const generateDict = (fileData: string) => {
  // match hangul in front of first tab and numbers at end of line
  // skip any non hangul characters in the beginning of the line
  const re = /[^\u3131-\uD79D]*([\u3131-\uD79D]*).*\t.*\t(\d*)$/m;

  const data = fileData
    .toString()
    .split('\n')
    .map((l) => {
      console.log('Reading line:', l);
      return l.trim().match(re).slice(1, 3);
    });

  return data.reduce((prev, curr) => {
    const [word, count] = curr;
    if (!word) return prev;

    const key = breakDownWord(word);
    const totalCount = parseInt(count) + (prev.has(key) ? prev.get(key)[0] : 0);
    prev.set(key, [totalCount, word]);
    return prev;
  }, new Map<string, [number, string]>());
};

export default generateDict;
