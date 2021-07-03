import { iterate_chop_last, stem } from '../korean/stemmer';

describe('stemmer functions', () => {
  test('iterate chop last', () => {
    expect(iterate_chop_last('fred')).toEqual(['f', 'fr', 'fre', 'fred']);
    expect(iterate_chop_last('안녕')).toEqual(['안', '안녕']);
  });

  test('finds dictionary forms', () => {
    expect(stem('가')).toContain('가다');
    expect(stem('가')).toContain('가다');
    expect(stem('가요')).toContain('가다');
    expect(stem('가요')).toContain('가다');
    expect(stem('가세요')).toContain('가다');
    expect(stem('기다려')).toContain('기다리다');
    expect(stem('기다렸어')).toContain('기다리다');
    expect(stem('저었어')).toContain('젓다');
    expect(stem('가셨습니까')).toContain('가시다');
    expect(stem('안녕하세요')).toContain('안녕하다');
    expect(stem('추워요')).toContain('춥다');
    expect(stem('지어')).toContain('짓다');
    expect(stem('도와')).toContain('돕다');
    expect(stem('더워')).toContain('덥다');
    expect(stem('갑니까')).toContain('갈다');
    expect(stem('삶')).toContain('살다');
    expect(stem('걸음')).toContain('걷다');
    expect(stem('해')).toContain('하다');
    expect(stem('까맣습니까')).toContain('까맣다');
    expect(stem('까매')).toContain('까맣다');
    expect(stem('그래')).toContain('그렇다');
    expect(stem('아파')).toContain('아프다');
    expect(stem('하세요')).toContain('하다');
    expect(stem('있으면')).toContain('있다');
    expect(stem('노란')).toContain('노랗다');
  });

  test('르 irregular', () => {
    expect(stem('일러')).toContain('이르다');
    expect(stem('일렀어')).toContain('이르다');
    expect(stem('이를 거야')).toContain('이르다');
    expect(stem('불러')).toContain('부르다');
    expect(stem('불렀어')).toContain('부르다');
    expect(stem('부를 거야')).toContain('부르다');
  });
});
