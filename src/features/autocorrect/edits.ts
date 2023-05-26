const alphabet =
  'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';

export const deleteJamo = (word: string) => {
  const deleteWords: string[] = [];

  for (let i = 0; i < word.length; i++) {
    deleteWords.push(word.slice(0, i) + word.slice(i + 1));
  }

  return deleteWords;
};

export const insertJamo = (word: string) => {
  const insertWords: string[] = [];

  for (let i = 0; i <= word.length; i++) {
    alphabet.split('').forEach((a) => {
      insertWords.push(word.slice(0, i) + a + word.slice(i));
    });
  }

  return insertWords;
};

export const replaceJamo = (word: string) => {
  const replaceWords: string[] = [];

  for (let i = 0; i < word.length; i++) {
    alphabet.split('').forEach((a) => {
      replaceWords.push(word.slice(0, i) + a + word.slice(i + 1));
    });
  }

  return replaceWords;
};
