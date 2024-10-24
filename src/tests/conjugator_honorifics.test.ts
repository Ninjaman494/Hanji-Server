import { equal } from 'assert';
import conjugator from '../korean/conjugator';

test('reasons', () => {
  // Informal low
  conjugator.reasons.length = 0;
  conjugator.declarative_present_informal_low_honorific('가다');
  expect(conjugator.reasons).toEqual([
    'join (가 + 시 -> 가시)',
    'vowel contraction [ㅣ ㅓ -> ㅕ] (가시 + 어 -> 가셔)',
  ]);
  conjugator.reasons.length = 0;
  conjugator.declarative_present_informal_low_honorific('먹다');
  expect(conjugator.reasons).toEqual([
    'padchim + consonant -> insert 으 (먹 + 시 -> 먹으시)',
    'vowel contraction [ㅣ ㅓ -> ㅕ] (먹으시 + 어 -> 먹으셔)',
  ]);

  // Informal high
  conjugator.reasons.length = 0;
  conjugator.declarative_present_informal_high_honorific('가다');
  expect(conjugator.reasons).toEqual(['join (가 + 세요 -> 가세요)']);
  conjugator.reasons.length = 0;
  conjugator.declarative_present_informal_high_honorific('먹다');
  expect(conjugator.reasons).toEqual([
    'padchim + consonant -> insert 으 (먹 + 세요 -> 먹으세요)',
  ]);
  conjugator.reasons.length = 0;
  conjugator.declarative_present_informal_high_honorific('춥다');
  expect(conjugator.reasons).toEqual(['join (추우 + 세요 -> 추우세요)']);
  conjugator.reasons.length = 0;
  conjugator.declarative_present_informal_high_honorific('되다');
  expect(conjugator.reasons).toEqual(['join (되 + 세요 -> 되세요)']);

  // Past formal high forms - Very long
  conjugator.reasons.length = 0;
  conjugator.declarative_past_formal_high_honorific('낫다');
  expect(conjugator.reasons).toEqual([
    'ㅅ irregular (낫 -> 나 [hidden padchim])',
    'padchim + consonant -> insert 으 (나 + 시 -> 나으시)',
    'vowel contraction [ㅣ ㅓ -> ㅕ] (나으시 + 어 -> 나으셔)',
    'vowel contraction [ㅕ ㅓ -> ㅕ] (나으셔 + 었 -> 나으셨)',
    'join (나으셨 + 습니다 -> 나으셨습니다)',
  ]);
  conjugator.reasons.length = 0;
  conjugator.interrogative_past_formal_high_honorific('낫다');
  expect(conjugator.reasons).toEqual([
    'ㅅ irregular (낫 -> 나 [hidden padchim])',
    'padchim + consonant -> insert 으 (나 + 시 -> 나으시)',
    'vowel contraction [ㅣ ㅓ -> ㅕ] (나으시 + 어 -> 나으셔)',
    'vowel contraction [ㅕ ㅓ -> ㅕ] (나으셔 + 었 -> 나으셨)',
    'join (나으셨 + 습니까 -> 나으셨습니까)',
  ]);
});

test('declarative present', async () => {
  equal(
    conjugator.declarative_present_informal_low_honorific('굽다', true),
    '굽으셔',
  );
  equal(
    conjugator.declarative_present_informal_low_honorific('굽다', false),
    '구우셔',
  );
  equal(
    conjugator.declarative_present_informal_low_honorific('듣다'),
    '들으셔',
  );
  equal(conjugator.declarative_present_informal_low_honorific('가다'), '가셔');
  equal(conjugator.declarative_present_informal_low_honorific('살다'), '사셔');
  equal(conjugator.declarative_present_informal_low_honorific('쓰다'), '쓰셔');

  equal(
    conjugator.declarative_present_informal_high_honorific('굽다', true),
    '굽으세요',
  );
  equal(
    conjugator.declarative_present_informal_high_honorific('굽다', false),
    '구우세요',
  );
  equal(
    conjugator.declarative_present_informal_high_honorific('듣다'),
    '들으세요',
  );
  equal(
    conjugator.declarative_present_informal_high_honorific('가다'),
    '가세요',
  );
  equal(
    conjugator.declarative_present_informal_high_honorific('살다'),
    '사세요',
  );
  equal(
    conjugator.declarative_present_informal_high_honorific('쓰다'),
    '쓰세요',
  );

  // Always honorific words. They shouldn't add an extra 시
  equal(
    conjugator.declarative_present_informal_high_honorific('계시다'),
    '계세요',
  );
  equal(
    conjugator.declarative_present_informal_high_honorific('드시다'),
    '드세요',
  );
  equal(
    conjugator.declarative_present_formal_high_honorific('드시다'),
    '드십니다',
  );

  equal(
    conjugator.declarative_present_formal_low_honorific('부르다', true, true),
    '부르시다',
  ); // adjective form
  equal(
    conjugator.declarative_present_formal_low_honorific('부르다', true, false),
    '부르신다',
  ); // verb form
  equal(conjugator.declarative_present_formal_low_honorific('살다'), '사신다');
  equal(
    conjugator.declarative_present_formal_low_honorific('오르다'),
    '오르신다',
  );
  equal(
    conjugator.declarative_present_formal_low_honorific('가늘다', true, true),
    '가느시다',
  );
  equal(
    conjugator.declarative_present_formal_low_honorific('춥다', false, true),
    '추우시다',
  );
  equal(
    conjugator.declarative_present_formal_low_honorific('쓰다', false, true),
    '쓰시다',
  );
  equal(
    conjugator.declarative_present_formal_low_honorific('있다'),
    '있으시다',
  );
  equal(
    conjugator.declarative_present_formal_low_honorific('없다'),
    '없으시다',
  );

  equal(
    conjugator.declarative_present_formal_high_honorific('살다'),
    '사십니다',
  );
  equal(
    conjugator.declarative_present_formal_high_honorific('오르다'),
    '오르십니다',
  );
  equal(
    conjugator.declarative_present_formal_high_honorific('굽다', true),
    '굽으십니다',
  );
  equal(
    conjugator.declarative_present_formal_high_honorific('굽다', false),
    '구우십니다',
  );
  equal(
    conjugator.declarative_present_formal_high_honorific('먹다'),
    '먹으십니다',
  );
  equal(
    conjugator.declarative_present_formal_high_honorific('쓰다'),
    '쓰십니다',
  );
});

test('declarative past', async () => {
  equal(
    conjugator.declarative_past_informal_low_honorific('굽다', true),
    '굽으셨어',
  );
  equal(
    conjugator.declarative_past_informal_low_honorific('굽다', false),
    '구우셨어',
  );
  equal(conjugator.declarative_past_informal_low_honorific('듣다'), '들으셨어');
  equal(conjugator.declarative_past_informal_low_honorific('가다'), '가셨어');
  equal(conjugator.declarative_past_informal_low_honorific('살다'), '사셨어');
  equal(conjugator.declarative_past_informal_low_honorific('쓰다'), '쓰셨어');

  equal(
    conjugator.declarative_past_informal_high_honorific('굽다', true),
    '굽으셨어요',
  );
  equal(
    conjugator.declarative_past_informal_high_honorific('굽다', false),
    '구우셨어요',
  );
  equal(
    conjugator.declarative_past_informal_high_honorific('듣다'),
    '들으셨어요',
  );
  equal(
    conjugator.declarative_past_informal_high_honorific('가다'),
    '가셨어요',
  );
  equal(
    conjugator.declarative_past_informal_high_honorific('살다'),
    '사셨어요',
  );
  equal(
    conjugator.declarative_past_informal_high_honorific('쓰다'),
    '쓰셨어요',
  );

  equal(conjugator.declarative_past_formal_low_honorific('살다'), '사셨다');
  equal(conjugator.declarative_past_formal_low_honorific('오르다'), '오르셨다');
  equal(
    conjugator.declarative_past_formal_low_honorific('가늘다', true, true),
    '가느셨다',
  );
  equal(
    conjugator.declarative_past_formal_low_honorific('춥다', false, true),
    '추우셨다',
  );
  equal(
    conjugator.declarative_past_formal_low_honorific('쓰다', false, true),
    '쓰셨다',
  );

  equal(
    conjugator.declarative_past_formal_high_honorific('살다'),
    '사셨습니다',
  );
  equal(
    conjugator.declarative_past_formal_high_honorific('오르다'),
    '오르셨습니다',
  );
  equal(
    conjugator.declarative_past_formal_high_honorific('굽다', true),
    '굽으셨습니다',
  );
  equal(
    conjugator.declarative_past_formal_high_honorific('굽다', false),
    '구우셨습니다',
  );
  equal(
    conjugator.declarative_past_formal_high_honorific('먹다'),
    '먹으셨습니다',
  );
  equal(
    conjugator.declarative_past_formal_high_honorific('쓰다'),
    '쓰셨습니다',
  );
});

test('declarative future', async () => {
  equal(
    conjugator.declarative_future_informal_low_honorific('굽다', true),
    '굽으실 거야',
  );
  equal(
    conjugator.declarative_future_informal_low_honorific('굽다', false),
    '구우실 거야',
  );
  equal(
    conjugator.declarative_future_informal_low_honorific('듣다'),
    '들으실 거야',
  );
  equal(
    conjugator.declarative_future_informal_low_honorific('가다'),
    '가실 거야',
  );
  equal(
    conjugator.declarative_future_informal_low_honorific('살다'),
    '사실 거야',
  );
  equal(
    conjugator.declarative_future_informal_low_honorific('쓰다'),
    '쓰실 거야',
  );
});

test('propositive', async () => {
  equal(conjugator.propositive_informal_low_honorific('가다'), '가셔'); // same as declarative
  equal(conjugator.propositive_informal_high_honorific('가다'), '가세요'); // same as declarative

  // Always honorific words. They shouldn't add an extra 시
  equal(conjugator.propositive_informal_high_honorific('계시다'), '계세요');
  equal(conjugator.propositive_informal_high_honorific('드시다'), '드세요');
  equal(conjugator.propositive_formal_high_honorific('계시다'), '계십시다');

  equal(conjugator.propositive_formal_low_honorific('가다'), '가시자');
  equal(conjugator.propositive_formal_low_honorific('듣다'), '들으시자');
  equal(conjugator.propositive_formal_low_honorific('살다'), '사시자');
  equal(conjugator.propositive_formal_low_honorific('쓰다'), '쓰시자');
  equal(conjugator.propositive_formal_low_honorific('열다'), '여시자');

  equal(conjugator.propositive_formal_high_honorific('가다'), '가십시다');
  equal(conjugator.propositive_formal_high_honorific('살다'), '사십시다');
  equal(conjugator.propositive_formal_high_honorific('눕다'), '누우십시다');
  equal(conjugator.propositive_formal_high_honorific('돕다'), '도우십시다');
  equal(conjugator.propositive_formal_high_honorific('열다'), '여십시다');
});

test('suppositive', async () => {
  equal(conjugator.suppositive_informal_low_honorific('열다'), '여시겠어');
  equal(conjugator.suppositive_informal_low_honorific('받다'), '받으시겠어');

  equal(conjugator.suppositive_informal_high_honorific('열다'), '여시겠어요');
  equal(conjugator.suppositive_informal_high_honorific('받다'), '받으시겠어요');

  equal(conjugator.suppositive_formal_low_honorific('열다'), '여시겠다');
  equal(conjugator.suppositive_formal_low_honorific('받다'), '받으시겠다');

  equal(conjugator.suppositive_formal_high_honorific('열다'), '여시겠습니다');
  equal(conjugator.suppositive_formal_high_honorific('받다'), '받으시겠습니다');
});

test('interrogative present', async () => {
  equal(
    conjugator.interrogative_present_informal_low_honorific('열다'),
    '여셔',
  ); // same as declarative
  equal(
    conjugator.interrogative_present_informal_high_honorific('열다'),
    '여세요',
  ); // same as declarative

  // Always honorific words. They shouldn't add an extra 시
  equal(
    conjugator.interrogative_present_informal_high_honorific('계시다'),
    '계세요',
  );
  equal(
    conjugator.interrogative_present_informal_high_honorific('드시다'),
    '드세요',
  );

  equal(
    conjugator.interrogative_present_formal_low_honorific('열다'),
    '여시느냐',
  );
  equal(
    conjugator.interrogative_present_formal_low_honorific('받다'),
    '받으시느냐',
  );
  equal(
    conjugator.interrogative_present_formal_low_honorific('춥다', false, true),
    '추우시냐',
  );
  equal(
    conjugator.interrogative_present_formal_low_honorific('크다', true, true),
    '크시냐',
  );
  equal(
    conjugator.interrogative_present_formal_low_honorific('있다'),
    '있으시냐',
  );
  equal(
    conjugator.interrogative_present_formal_low_honorific('없다'),
    '없으시냐',
  );

  equal(
    conjugator.interrogative_present_formal_high_honorific('열다'),
    '여십니까',
  );
  equal(
    conjugator.interrogative_present_formal_high_honorific('받다'),
    '받으십니까',
  );
  equal(
    conjugator.interrogative_present_formal_high_honorific('춥다'),
    '추우십니까',
  );
  equal(
    conjugator.interrogative_present_formal_high_honorific('크다', true, true),
    '크십니까',
  );
});

test('interrogative past', async () => {
  equal(conjugator.interrogative_past_informal_low_honorific('열다'), '여셨어'); // same as declarative
  equal(
    conjugator.interrogative_past_informal_high_honorific('열다'),
    '여셨어요',
  ); // same as declarative

  equal(conjugator.interrogative_past_formal_low_honorific('열다'), '여셨느냐');
  equal(
    conjugator.interrogative_past_formal_low_honorific('받다'),
    '받으셨느냐',
  );
  equal(
    conjugator.interrogative_past_formal_low_honorific('춥다', false, true),
    '추우셨냐',
  );
  equal(
    conjugator.interrogative_past_formal_low_honorific('크다', true, true),
    '크셨냐',
  );
  equal(conjugator.interrogative_past_formal_low_honorific('있다'), '있으셨냐');
  equal(conjugator.interrogative_past_formal_low_honorific('없다'), '없으셨냐');

  equal(
    conjugator.interrogative_past_formal_high_honorific('열다'),
    '여셨습니까',
  );
  equal(
    conjugator.interrogative_past_formal_high_honorific('받다'),
    '받으셨습니까',
  );
  equal(
    conjugator.interrogative_past_formal_high_honorific('춥다'),
    '추우셨습니까',
  );
  equal(
    conjugator.interrogative_past_formal_high_honorific('크다', true, true),
    '크셨습니까',
  );
});

test('imperative', async () => {
  equal(conjugator.imperative_informal_low_honorific('가다'), '가셔');

  equal(conjugator.imperative_informal_high_honorific('가다'), '가세요');
  equal(conjugator.imperative_informal_high_honorific('살다'), '사세요');

  // Always honorific words. They shouldn't add an extra 시
  equal(conjugator.imperative_informal_high_honorific('계시다'), '계세요');
  equal(conjugator.imperative_informal_high_honorific('드시다'), '드세요');

  equal(conjugator.imperative_formal_low_honorific('가다'), '가셔라');
  equal(conjugator.imperative_formal_low_honorific('굽다'), '구우셔라');
  equal(conjugator.imperative_formal_low_honorific('살다'), '사셔라');
  equal(conjugator.imperative_formal_low_honorific('서다'), '서셔라');
  equal(conjugator.imperative_formal_low_honorific('뵙다'), '뵈셔라');

  equal(conjugator.imperative_formal_high_honorific('가다'), '가십시오');
  equal(conjugator.imperative_formal_high_honorific('걷다'), '걸으십시오');
  equal(conjugator.imperative_formal_high_honorific('돕다'), '도우십시오');
});

test('nominal ing', async () => {
  equal(conjugator.nominal_ing_honorific('살다'), '사심');
  equal(conjugator.nominal_ing_honorific('걷다'), '걸으심');
  equal(conjugator.nominal_ing_honorific('가져오다'), '가져오심');
  equal(conjugator.nominal_ing_honorific('그렇다'), '그러심');
  equal(conjugator.nominal_ing_honorific('까맣다'), '까마심');
  equal(conjugator.nominal_ing_honorific('돕다'), '도우심');
});

test('connective if', async () => {
  equal(conjugator.connective_if_honorific('낫'), '나으시면');
  equal(conjugator.connective_if_honorific('가'), '가시면');
  equal(conjugator.connective_if_honorific('살'), '사시면');
  equal(conjugator.connective_if_honorific('푸르다'), '푸르시면');
  equal(conjugator.connective_if_honorific('돕다'), '도우시면');
});

test('connective and', async () => {
  equal(conjugator.connective_and_honorific('가다'), '가시고');
  equal(conjugator.connective_and_honorific('듣다'), '들으시고');
  equal(conjugator.connective_and_honorific('춥다'), '추우시고');
});

test('connective but', async () => {
  equal(conjugator.connective_but_honorific('가다'), '가시지만');
  equal(conjugator.connective_but_honorific('듣다'), '들으시지만');
  equal(conjugator.connective_but_honorific('춥다'), '추우시지만');
  equal(conjugator.connective_but_honorific('받다'), '받으시지만');
});

test('determiner present', async () => {
  equal(conjugator.determiner_present_honorific('차다', true, false), '차시는');
  equal(
    conjugator.determiner_present_honorific('받다', true, false),
    '받으시는',
  );
  equal(
    conjugator.determiner_present_honorific('듣다', false, false),
    '들으시는',
  );
  equal(conjugator.determiner_present_honorific('살다', true, false), '사시는');
  equal(conjugator.determiner_present_honorific('차다', true, true), '차신');
  equal(conjugator.determiner_present_honorific('같다', true, true), '같으신');
  equal(conjugator.determiner_present_honorific('걸다', false, true), '거신');
  equal(
    conjugator.determiner_present_honorific('멋있다', true, false),
    '멋있으신',
  ); // 있다 exception
  equal(
    conjugator.determiner_present_honorific('재미없다', true, false),
    '재미없으신',
  ); // 없다 exception
});

test('determiner past', async () => {
  equal(conjugator.determiner_past_honorific('차다', true, false), '차신');
  equal(conjugator.determiner_past_honorific('받다', true, false), '받으신');
  equal(conjugator.determiner_past_honorific('듣다', false, false), '들으신');
  equal(conjugator.determiner_past_honorific('굽다', true, false), '굽으신');
  equal(conjugator.determiner_past_honorific('살다', false, false), '사신');
  equal(conjugator.determiner_past_honorific('차다', true, true), undefined);
  equal(conjugator.determiner_past_honorific('멋있다', true, false), undefined); // 있다 exception
  equal(
    conjugator.determiner_past_honorific('재미없다', true, false),
    undefined,
  ); // 없다 exception
});

test('determiner future', async () => {
  equal(conjugator.determiner_future_honorific('차다'), '차실');
  equal(conjugator.determiner_future_honorific('받다'), '받으실');
  equal(conjugator.determiner_future_honorific('부르다'), '부르실');
  equal(conjugator.determiner_future_honorific('춥다'), '추우실');
  equal(conjugator.determiner_future_honorific('같다'), '같으실');
  equal(conjugator.determiner_future_honorific('걸다'), '거실');
  equal(conjugator.determiner_future_honorific('열다'), '여실');
  equal(conjugator.determiner_future_honorific('있다'), '있으실');
  equal(conjugator.determiner_future_honorific('없다'), '없으실');
});
