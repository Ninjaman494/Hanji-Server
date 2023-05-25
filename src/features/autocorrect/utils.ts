import { invert } from 'lodash';

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

export const firstThirdMap = {
  ᄀ: 'ᆨ',
  ᄁ: 'ᆩ',
  ᄂ: 'ᆫ',
  ᄃ: 'ᆮ',
  // ᄄ: '\u11ac',
  ᄅ: 'ᆯ',
  ᄆ: 'ᆷ',
  ᄇ: 'ᆸ',
  // ᄈ: '\u11b0',
  ᄉ: 'ᆺ',
  ᄊ: 'ᆻ',
  ᄋ: 'ᆼ',
  ᄌ: 'ᆽ',
  // ᄍ: '\u11b0',
  ᄎ: 'ᆾ',
  ᄏ: 'ᆿ',
  ᄐ: 'ᇀ',
  ᄑ: 'ᇁ',
  ᄒ: 'ᇂ',
};

export const thirdFirstMap = invert(firstThirdMap);
