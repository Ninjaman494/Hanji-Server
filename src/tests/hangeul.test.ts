import {
  is_hangeul,
  is_hangeul_string,
  find_vowel_to_append,
  match,
  lead,
  vowel,
  padchim,
  join,
  Geulja,
} from '../korean/hangeul';

describe('hangeul functions', () => {
  test('detect hangul strings', () => {
    expect(is_hangeul('안')).toBeTruthy();
    expect(is_hangeul_string('안녕')).toBeTruthy();
    expect(is_hangeul_string('안peace')).toBeFalsy();
    expect(is_hangeul_string('안 녕')).toBeTruthy();
    expect(is_hangeul_string('안녕!')).toBeTruthy();
    expect(is_hangeul_string('die')).toBeFalsy();
  });

  test('get leading consonant from jamo', () => {
    expect(lead('가')).toEqual('ᄀ');
    expect(lead('만')).toEqual('ᄆ');
    expect(lead('짉')).toEqual('ᄌ');
  });

  test('get vowel from jamo', () => {
    expect(vowel('갓')).toEqual('ㅏ');
    expect(vowel('빩')).toEqual('ㅏ');
    expect(vowel('법')).toEqual('ㅓ');
    expect(vowel('가')).toEqual('ㅏ');
  });

  test('get padchim from jamo', () => {
    expect(padchim('강')).toEqual('ᆼ');
  });

  test('join letters into jamo', () => {
    expect(join('ᄀ', 'ㅏ')).toEqual('가');
    expect(join('ᄆ', 'ㅕ', 'ᆫ')).toEqual('면');
    expect(join('ᄈ', 'ㅙ', 'ᆶ')).toEqual('뾇');
  });

  test('find vowel to append', () => {
    expect(find_vowel_to_append('아프')).toEqual('아');
    expect(find_vowel_to_append('흐르')).toEqual('어');
    expect(find_vowel_to_append('태우')).toEqual('어');
    expect(find_vowel_to_append('만들')).toEqual('어');
    expect(find_vowel_to_append('앗')).toEqual('아');
  });

  test('match letter combinations to jamos', () => {
    expect(match('아', '*', 'ㅏ')).toBeTruthy();
    expect(match('왅', '*', 'ㅏ')).toBeFalsy();
    expect(match('아', 'ᄋ', 'ㅏ')).toBeTruthy();
    expect(match('아', 'ᄋ', 'ㅏ', null)).toBeTruthy();
    expect(match('읽', '*', '*', 'ᆰ')).toBeTruthy();
    expect(match('읽', '*', '*', null)).toBeFalsy();
  });

  test('Geulja', () => {
    let geulja = new Geulja('나');
    geulja.hidden_padchim = true;
    expect(padchim(geulja)).toBeTruthy();

    geulja = new Geulja('걸');
    geulja.original_padchim = 'ㄷ';
    expect(padchim(geulja)).toEqual('ㄷ');

    geulja.charAt(0);

    geulja = new Geulja('나');
    geulja.hidden_padchim = true;
    expect(geulja.charAt(0)).toEqual('나');
    expect(geulja.charAt(-1).hidden_padchim).toBeTruthy();
  });
});
