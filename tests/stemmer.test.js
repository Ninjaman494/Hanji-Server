stemmer = require('../korean/stemmer');

test('iterate chop last', () => {
    expect(stemmer.iterate_chop_last('fred')).toEqual(['f', 'fr', 'fre', 'fred']);
    expect(stemmer.iterate_chop_last('안녕')).toEqual(['안', '안녕']);
});

test('finds dictionary forms', () => {
    expect(stemmer.stem('가')).toContain('가다');
    expect(stemmer.stem('가')).toContain('가다');
    expect(stemmer.stem('가요')).toContain('가다');
    expect(stemmer.stem('가요')).toContain('가다');
    expect(stemmer.stem('가세요')).toContain('가다');
    expect(stemmer.stem('기다려')).toContain('기다리다');
    expect(stemmer.stem('기다렸어')).toContain('기다리다');
    expect(stemmer.stem('저었어')).toContain('젓다');
    expect(stemmer.stem('가셨습니까')).toContain('가시다');
    expect(stemmer.stem('안녕하세요')).toContain('안녕하다');
    expect(stemmer.stem('추워요')).toContain('춥다');
    expect(stemmer.stem('지어')).toContain('짓다');
    expect(stemmer.stem('도와')).toContain('돕다');
    expect(stemmer.stem('더워')).toContain('덥다');
    expect(stemmer.stem('갑니까')).toContain('갈다');
    expect(stemmer.stem('삶')).toContain('살다');
    expect(stemmer.stem('걸음')).toContain('걷다');
    expect(stemmer.stem('해')).toContain('하다');
    expect(stemmer.stem('까맣습니까')).toContain('까맣다');
    expect(stemmer.stem('까매')).toContain('까맣다');
    expect(stemmer.stem('그래')).toContain('그렇다');
    expect(stemmer.stem('아파')).toContain('아프다');
    expect(stemmer.stem('하세요')).toContain('하다');
    expect(stemmer.stem('있으면')).toContain('있다');
});