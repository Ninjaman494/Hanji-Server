hangeul = require('../korean/hangeul');

test('detect hangul strings', () => {
    expect(hangeul.is_hangeul('안')).toBeTruthy();
    expect(hangeul.is_hangeul_string('안녕')).toBeTruthy();
    expect(hangeul.is_hangeul_string('안peace')).toBeFalsy();
    expect(hangeul.is_hangeul_string('안 녕')).toBeTruthy();
    expect(hangeul.is_hangeul_string('안녕!')).toBeTruthy();
    expect(hangeul.is_hangeul_string('die')).toBeFalsy();
});

test('get leading consonant from jamo', () => {
    expect(hangeul.lead('가')).toEqual('ᄀ');
    expect(hangeul.lead('만')).toEqual('ᄆ');
    expect(hangeul.lead('짉')).toEqual('ᄌ');
});

test('get vowel from jamo', () => {
    expect(hangeul.vowel('갓')).toEqual('ㅏ');
    expect(hangeul.vowel('빩')).toEqual('ㅏ');
    expect(hangeul.vowel('법')).toEqual('ㅓ');
    expect(hangeul.vowel('가')).toEqual('ㅏ');
});

test('get padchim from jamo', () => {
    expect(hangeul.padchim('강')).toEqual('ᆼ');
});

test('join letters into jamo', () => {
    expect(hangeul.join('ᄀ', 'ㅏ')).toEqual('가');
    expect(hangeul.join('ᄆ', 'ㅕ', 'ᆫ')).toEqual('면');
    expect(hangeul.join('ᄈ', 'ㅙ', 'ᆶ')).toEqual('뾇');
});

test('find vowel to append', () => {
    expect(hangeul.find_vowel_to_append('아프')).toEqual('아');
    expect(hangeul.find_vowel_to_append('흐르')).toEqual('어');
    expect(hangeul.find_vowel_to_append('태우')).toEqual('어');
    expect(hangeul.find_vowel_to_append('만들')).toEqual('어');
    expect(hangeul.find_vowel_to_append('앗')).toEqual('아');
});

test('match letter combinations to jamos', () => {
    expect(hangeul.match('아', '*', 'ㅏ')).toBeTruthy();
    expect(hangeul.match('왅', '*', 'ㅏ')).toBeFalsy();
    expect(hangeul.match('아', 'ᄋ','ㅏ')).toBeTruthy();
    expect(hangeul.match('아', 'ᄋ','ㅏ', null)).toBeTruthy();
    expect(hangeul.match('읽', '*', '*', 'ᆰ')).toBeTruthy();
    expect(hangeul.match('읽', '*', '*', null)).toBeFalsy();
});

test('test Geulja', () => {
    let geulja = new hangeul.Geulja('나');
    geulja.hidden_padchim = true;
    expect(hangeul.padchim(geulja)).toBeTruthy();

    geulja = new hangeul.Geulja('걸');
    geulja.original_padchim = 'ㄷ';
    expect(hangeul.padchim(geulja)).toEqual('ㄷ');

    geulja = new hangeul.Geulja('나');
    geulja.hidden_padchim = true;
    expect(geulja.charAt(0)).toEqual('나');
    expect(geulja.charAt(-1).hidden_padchim).toBeTruthy();
});