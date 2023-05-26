const alphabet =
  'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';

export const deleteJamo = (word: string) => {
  const deleteWords = new Set<string>();

  for (let i = 0; i < word.length; i++) {
    deleteWords.add(word.slice(0, i) + word.slice(i + 1));
  }

  return deleteWords;
};

export const insertJamo = (word: string) => {
  const insertWords = new Set<string>();

  for (let i = 0; i <= word.length; i++) {
    alphabet.split('').forEach((a) => {
      insertWords.add(word.slice(0, i) + a + word.slice(i));
    });
  }

  return insertWords;
};

export const replaceJamo = (word: string) => {
  const replaceWords = new Set<string>();

  for (let i = 0; i < word.length; i++) {
    alphabet.split('').forEach((a) => {
      replaceWords.add(word.slice(0, i) + a + word.slice(i + 1));
    });
  }

  return replaceWords;
};
