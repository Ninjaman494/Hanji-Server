export const isVowel = (jamo: string) => {
  const charCode = jamo.charCodeAt(0);
  return charCode >= 'ㅏ'.charCodeAt(0) && charCode <= 'ㅣ'.charCodeAt(0);
};

export const stringAsUnicodeEscape = (input) => {
  function pad_four(input) {
    const l = input.length;
    if (l == 0) return '0000';
    if (l == 1) return '000' + input;
    if (l == 2) return '00' + input;
    if (l == 3) return '0' + input;
    return input;
  }
  let output = '';
  for (let i = 0, l = input.length; i < l; i++)
    output += '\\u' + pad_four(input.charCodeAt(i).toString(16));
  return output;
};

export const normalizeJamo = (jamo: string) => {
  const compatForm = firstMap[jamo] ?? secondMap[jamo] ?? thirdMap[jamo];
  return padchimBreakdown[compatForm] ?? compatForm;
};

const firstMap = {
  ᄀ: 'ㄱ',
  ᄁ: 'ㄲ',
  ᄂ: 'ㄴ',
  ᄃ: 'ㄷ',
  ᄄ: 'ㄸ',
  ᄅ: 'ㄹ',
  ᄆ: 'ㅁ',
  ᄇ: 'ㅂ',
  ᄈ: 'ㅃ',
  ᄉ: 'ㅅ',
  ᄊ: 'ㅆ',
  ᄋ: 'ㅇ',
  ᄌ: 'ㅈ',
  ᄍ: 'ㅉ',
  ᄎ: 'ㅊ',
  ᄏ: 'ㅋ',
  ᄐ: 'ㅌ',
  ᄑ: 'ㅍ',
  ᄒ: 'ㅎ',
};

const secondMap = {
  ᅡ: 'ㅏ',
  ᅢ: 'ㅐ',
  ᅣ: 'ㅑ',
  ᅤ: 'ㅒ',
  ᅥ: 'ㅓ',
  ᅦ: 'ㅔ',
  ᅧ: 'ㅕ',
  ᅨ: 'ㅖ',
  ᅩ: 'ㅗ',
  ᅪ: 'ㅘ',
  ᅫ: 'ㅙ',
  ᅬ: 'ㅚ',
  ᅭ: 'ㅛ',
  ᅮ: 'ㅜ',
  ᅯ: 'ㅝ',
  ᅰ: 'ㅞ',
  ᅱ: 'ㅟ',
  ᅲ: 'ㅠ',
  ᅳ: 'ㅡ',
  ᅴ: 'ㅢ',
  ᅵ: 'ㅣ',
};

const thirdMap = {
  ᆨ: 'ㄱ',
  ᆩ: 'ㄲ',
  ᆪ: 'ㄳ',
  ᆫ: 'ㄴ',
  ᆬ: 'ㄵ',
  ᆭ: 'ㄶ',
  ᆮ: 'ㄷ',
  ᆯ: 'ㄹ',
  ᆰ: 'ㄺ',
  ᆱ: 'ㄻ',
  ᆲ: 'ㄼ',
  ᆳ: 'ㄽ',
  ᆴ: 'ㄾ',
  ᆵ: 'ㄿ',
  ᆶ: 'ㅀ',
  ᆷ: 'ㅁ',
  ᆸ: 'ㅂ',
  ᆹ: 'ㅄ',
  ᆺ: 'ㅅ',
  ᆻ: 'ㅆ',
  ᆼ: 'ㅇ',
  ᆽ: 'ㅈ',
  ᆾ: 'ㅊ',
  ᆿ: 'ㅋ',
  ᇀ: 'ㅌ',
  ᇁ: 'ㅍ',
  ᇂ: 'ㅎ',
};

const padchimBreakdown = {
  ㄳ: 'ㄱㅅ',
  ㄵ: 'ㄴㅈ',
  ㄶ: 'ㄴㅎ',
  ㄺ: 'ㄹㄱ',
  ㄻ: 'ㄹㅁ',
  ㄼ: 'ㄹㅂ',
  ㄽ: 'ㄹㅅ',
  ㄾ: 'ㄹㅌ',
  ㄿ: 'ㄹㅍ',
  ㅀ: 'ㄹㅎ',
  ㅄ: 'ㅂㅅ',
};
