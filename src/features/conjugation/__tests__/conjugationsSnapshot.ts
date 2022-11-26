export const SPECIFIC_CONJUGATIONS = [
  {
    name: 'connective if',
    conjugation: '가면',
    type: 'connective',
    tense: 'none',
    speechLevel: 'none',
    honorific: false,
    pronunciation: '가면',
    romanization: 'gah-myuhn',
    reasons: ['join (가 + 면 -> 가면)'],
  },
  {
    name: 'declarative present informal high',
    conjugation: '가세요',
    type: 'declarative present',
    tense: 'present',
    speechLevel: 'informal high',
    honorific: true,
    pronunciation: '가세요',
    romanization: 'gah-sae-yoh',
    reasons: ['join (가 + 세요 -> 가세요)'],
  },
  {
    name: 'propositive informal low',
    conjugation: '가',
    type: 'propositive',
    tense: 'present',
    speechLevel: 'informal low',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
];

export const CONJUGATIONS = [
  {
    name: 'connective if',
    conjugation: '가면',
    romanization: 'gah-myuhn',
    tense: 'none',
    speechLevel: 'none',
    pronunciation: '가면',
    reasons: ['join (가 + 면 -> 가면)'],
    type: 'connective',
    honorific: false,
  },
  {
    name: 'connective and',
    conjugation: '가고',
    romanization: 'gah-goh',
    tense: 'none',
    speechLevel: 'none',
    pronunciation: '가고',
    reasons: ['join (가 + 고 -> 가고)'],
    type: 'connective',
    honorific: false,
  },
  {
    name: 'connective but',
    conjugation: '가지만',
    romanization: 'gah-chee-mahn',
    tense: 'none',
    speechLevel: 'none',
    pronunciation: '가지만',
    reasons: ['join (가 + 지만 -> 가지만)'],
    type: 'connective',
    honorific: false,
  },
  {
    name: 'declarative present informal low',
    conjugation: '가',
    romanization: 'gah',
    tense: 'present',
    speechLevel: 'informal low',
    pronunciation: '가',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
    type: 'declarative present',
    honorific: false,
  },
  {
    name: 'declarative present informal high',
    conjugation: '가요',
    romanization: 'gah-yoh',
    tense: 'present',
    speechLevel: 'informal high',
    pronunciation: '가요',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
    type: 'declarative present',
    honorific: false,
  },
  {
    name: 'declarative present formal low',
    conjugation: '간다',
    romanization: 'gahn-dah',
    tense: 'present',
    speechLevel: 'formal low',
    pronunciation: '간다',
    reasons: ['borrow padchim (가 + 는다 -> 간다)'],
    type: 'declarative present',
    honorific: false,
  },
  {
    name: 'declarative present formal high',
    conjugation: '갑니다',
    romanization: 'gahm-nee-dah',
    tense: 'present',
    speechLevel: 'formal high',
    pronunciation: '감니다',
    reasons: ['borrow padchim (가 + 습니다 -> 갑니다)'],
    type: 'declarative present',
    honorific: false,
  },
  {
    name: 'declarative past informal low',
    conjugation: '갔어',
    romanization: 'gah-ssuh',
    tense: 'past',
    speechLevel: 'informal low',
    pronunciation: '가써',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
    ],
    type: 'declarative past',
    honorific: false,
  },
  {
    name: 'declarative past informal high',
    conjugation: '갔어요',
    romanization: 'gah-ssuh-yoh',
    tense: 'past',
    speechLevel: 'informal high',
    pronunciation: '가써요',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
      'join (갔어 + 요 -> 갔어요)',
    ],
    type: 'declarative past',
    honorific: false,
  },
  {
    name: 'declarative past formal low',
    conjugation: '갔다',
    romanization: 'gah-ttah',
    tense: 'past',
    speechLevel: 'formal low',
    pronunciation: '가따',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 다 -> 갔다)',
    ],
    type: 'declarative past',
    honorific: false,
  },
  {
    name: 'declarative past formal high',
    conjugation: '갔습니다',
    romanization: 'gah-sseum-nee-dah',
    tense: 'past',
    speechLevel: 'formal high',
    pronunciation: '가씀니다',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 습니다 -> 갔습니다)',
    ],
    type: 'declarative past',
    honorific: false,
  },
  {
    name: 'declarative future informal low',
    conjugation: '갈 거야',
    romanization: 'gahl- -guh-yah',
    tense: 'future',
    speechLevel: 'informal low',
    pronunciation: '갈 거야',
    reasons: ['borrow padchim (가 + 을 -> 갈)', 'join (갈 +  거야 -> 갈 거야)'],
    type: 'declarative future',
    honorific: false,
  },
  {
    name: 'declarative future informal high',
    conjugation: '갈 거예요',
    romanization: 'gahl- -guh-yae-yoh',
    tense: 'future',
    speechLevel: 'informal high',
    pronunciation: '갈 거예요',
    reasons: [
      'borrow padchim (가 + 을 -> 갈)',
      'join (갈 +  거예요 -> 갈 거예요)',
    ],
    type: 'declarative future',
    honorific: false,
  },
  {
    name: 'declarative future formal low',
    conjugation: '갈 거다',
    romanization: 'gahl- -guh-dah',
    tense: 'future',
    speechLevel: 'formal low',
    pronunciation: '갈 거다',
    reasons: ['borrow padchim (가 + 을 -> 갈)', 'join (갈 +  거다 -> 갈 거다)'],
    type: 'declarative future',
    honorific: false,
  },
  {
    name: 'declarative future formal high',
    conjugation: '갈 겁니다',
    romanization: 'gahl- -guhm-nee-dah',
    tense: 'future',
    speechLevel: 'formal high',
    pronunciation: '갈 검니다',
    reasons: [
      'borrow padchim (가 + 을 -> 갈)',
      'join (갈 +  겁니다 -> 갈 겁니다)',
    ],
    type: 'declarative future',
    honorific: false,
  },
  {
    name: 'determiner present',
    conjugation: '가는',
    romanization: 'gah-neun',
    tense: 'present',
    speechLevel: 'none',
    pronunciation: '가는',
    reasons: ['join (가 + 는 -> 가는)'],
    type: 'determiner',
    honorific: false,
  },
  {
    name: 'determiner past',
    conjugation: '간',
    romanization: 'gahn',
    tense: 'past',
    speechLevel: 'none',
    pronunciation: '간',
    reasons: ['borrow padchim (가 + 은 -> 간)'],
    type: 'determiner',
    honorific: false,
  },
  {
    name: 'determiner future',
    conjugation: '갈',
    romanization: 'gahl',
    tense: 'future',
    speechLevel: 'none',
    pronunciation: '갈',
    reasons: ['borrow padchim (가 + 을 -> 갈)'],
    type: 'determiner',
    honorific: false,
  },
  {
    name: 'imperative informal low',
    conjugation: '가',
    romanization: 'gah',
    tense: 'present',
    speechLevel: 'informal low',
    pronunciation: '가',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
    type: 'imperative',
    honorific: false,
  },
  {
    name: 'imperative informal high',
    conjugation: '가요',
    romanization: 'gah-yoh',
    tense: 'present',
    speechLevel: 'informal high',
    pronunciation: '가요',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
    type: 'imperative',
    honorific: false,
  },
  {
    name: 'imperative formal low',
    conjugation: '가라',
    romanization: 'gah-rah',
    tense: 'present',
    speechLevel: 'formal low',
    pronunciation: '가라',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 라 -> 가라)',
    ],
    type: 'imperative',
    honorific: false,
  },
  {
    name: 'imperative formal high',
    conjugation: '가십시오',
    romanization: 'gah-sheep-shee-oh',
    tense: 'present',
    speechLevel: 'formal high',
    pronunciation: '가십씨오',
    reasons: ['join (가 + 십시오 -> 가십시오)'],
    type: 'imperative',
    honorific: false,
  },
  {
    name: 'interrogative present informal low',
    conjugation: '가',
    romanization: 'gah',
    tense: 'present',
    speechLevel: 'informal low',
    pronunciation: '가',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
    type: 'interrogative present',
    honorific: false,
  },
  {
    name: 'interrogative present informal high',
    conjugation: '가요',
    romanization: 'gah-yoh',
    tense: 'present',
    speechLevel: 'informal high',
    pronunciation: '가요',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
    type: 'interrogative present',
    honorific: false,
  },
  {
    name: 'interrogative present formal low',
    conjugation: '가느냐',
    romanization: 'gah-neu-nyah',
    tense: 'present',
    speechLevel: 'formal low',
    pronunciation: '가느냐',
    reasons: ['join (가 + 느냐 -> 가느냐)'],
    type: 'interrogative present',
    honorific: false,
  },
  {
    name: 'interrogative present formal high',
    conjugation: '갑니까',
    romanization: 'gahm-nee-ggah',
    tense: 'present',
    speechLevel: 'formal high',
    pronunciation: '감니까',
    reasons: ['borrow padchim (가 + 습니까 -> 갑니까)'],
    type: 'interrogative present',
    honorific: false,
  },
  {
    name: 'interrogative past informal low',
    conjugation: '갔어',
    romanization: 'gah-ssuh',
    tense: 'past',
    speechLevel: 'informal low',
    pronunciation: '가써',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
    ],
    type: 'interrogative past',
    honorific: false,
  },
  {
    name: 'interrogative past informal high',
    conjugation: '갔어요',
    romanization: 'gah-ssuh-yoh',
    tense: 'past',
    speechLevel: 'informal high',
    pronunciation: '가써요',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
      'join (갔어 + 요 -> 갔어요)',
    ],
    type: 'interrogative past',
    honorific: false,
  },
  {
    name: 'interrogative past formal low',
    conjugation: '갔느냐',
    romanization: 'gahn-neu-nyah',
    tense: 'past',
    speechLevel: 'formal low',
    pronunciation: '간느냐',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 느냐 -> 갔느냐)',
    ],
    type: 'interrogative past',
    honorific: false,
  },
  {
    name: 'interrogative past formal high',
    conjugation: '갔습니까',
    romanization: 'gah-sseum-nee-ggah',
    tense: 'past',
    speechLevel: 'formal high',
    pronunciation: '가씀니까',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 습니까 -> 갔습니까)',
    ],
    type: 'interrogative past',
    honorific: false,
  },
  {
    name: 'nominal ing',
    conjugation: '감',
    romanization: 'gahm',
    tense: 'none',
    speechLevel: 'none',
    pronunciation: '감',
    reasons: ['borrow padchim (가 + 음 -> 감)'],
    type: 'verbal noun',
    honorific: false,
  },
  {
    name: 'propositive informal low',
    conjugation: '가',
    romanization: 'gah',
    tense: 'present',
    speechLevel: 'informal low',
    pronunciation: '가',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
    type: 'propositive',
    honorific: false,
  },
  {
    name: 'propositive informal high',
    conjugation: '가요',
    romanization: 'gah-yoh',
    tense: 'present',
    speechLevel: 'informal high',
    pronunciation: '가요',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
    type: 'propositive',
    honorific: false,
  },
  {
    name: 'propositive formal low',
    conjugation: '가자',
    romanization: 'gah-chah',
    tense: 'present',
    speechLevel: 'formal low',
    pronunciation: '가자',
    reasons: ['join (가 + 자 -> 가자)'],
    type: 'propositive',
    honorific: false,
  },
  {
    name: 'propositive formal high',
    conjugation: '갑시다',
    romanization: 'gahp-shee-dah',
    tense: 'present',
    speechLevel: 'formal high',
    pronunciation: '갑씨다',
    reasons: ['borrow padchim (가 + 읍시다 -> 갑시다)'],
    type: 'propositive',
    honorific: false,
  },
  {
    name: 'suppositive informal low',
    conjugation: '가겠어',
    romanization: 'gah-gae-ssuh',
    tense: 'none',
    speechLevel: 'informal low',
    pronunciation: '가게써',
    reasons: ['join (가 + 겠어 -> 가겠어)'],
    type: 'suppositive',
    honorific: false,
  },
  {
    name: 'suppositive informal high',
    conjugation: '가겠어요',
    romanization: 'gah-gae-ssuh-yoh',
    tense: 'none',
    speechLevel: 'informal high',
    pronunciation: '가게써요',
    reasons: ['join (가 + 겠어요 -> 가겠어요)'],
    type: 'suppositive',
    honorific: false,
  },
  {
    name: 'suppositive formal low',
    conjugation: '가겠다',
    romanization: 'gah-gae-ttah',
    tense: 'none',
    speechLevel: 'formal low',
    pronunciation: '가게따',
    reasons: ['join (가 + 겠다 -> 가겠다)'],
    type: 'suppositive',
    honorific: false,
  },
  {
    name: 'suppositive formal high',
    conjugation: '가겠습니다',
    romanization: 'gah-gae-sseum-nee-dah',
    tense: 'none',
    speechLevel: 'formal high',
    pronunciation: '가게씀니다',
    reasons: ['join (가 + 겠습니다 -> 가겠습니다)'],
    type: 'suppositive',
    honorific: false,
  },
];

/**
 * The integration version passes through enum
 * modifications (i.e. `formal low` to `FORMAL_LOW`)
 * and is what the API returns in production
 */
export const SPECIFIC_CONJUGATIONS_INTEGRATION = [
  {
    name: 'connective if',
    conjugation: '가면',
    type: 'connective',
    tense: 'NONE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '가면',
    romanization: 'gah-myuhn',
    reasons: ['join (가 + 면 -> 가면)'],
  },
  {
    name: 'declarative present informal high',
    conjugation: '가세요',
    type: 'declarative present',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_HIGH',
    honorific: true,
    pronunciation: '가세요',
    romanization: 'gah-sae-yoh',
    reasons: ['join (가 + 세요 -> 가세요)'],
  },
  {
    name: 'propositive informal low',
    conjugation: '가',
    type: 'propositive',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
];

/**
 * The integration version passes through enum
 * modifications (i.e. `formal low` to `FORMAL_LOW`)
 * and is what the API returns in production
 */
export const CONJUGATIONS_INTEGRATION = [
  {
    name: 'connective if',
    conjugation: '가면',
    type: 'connective',
    tense: 'NONE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '가면',
    romanization: 'gah-myuhn',
    reasons: ['join (가 + 면 -> 가면)'],
  },
  {
    name: 'connective and',
    conjugation: '가고',
    type: 'connective',
    tense: 'NONE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '가고',
    romanization: 'gah-goh',
    reasons: ['join (가 + 고 -> 가고)'],
  },
  {
    name: 'connective but',
    conjugation: '가지만',
    type: 'connective',
    tense: 'NONE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '가지만',
    romanization: 'gah-chee-mahn',
    reasons: ['join (가 + 지만 -> 가지만)'],
  },
  {
    name: 'declarative present informal low',
    conjugation: '가',
    type: 'declarative present',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
  {
    name: 'declarative present informal high',
    conjugation: '가요',
    type: 'declarative present',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가요',
    romanization: 'gah-yoh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
  },
  {
    name: 'declarative present formal low',
    conjugation: '간다',
    type: 'declarative present',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '간다',
    romanization: 'gahn-dah',
    reasons: ['borrow padchim (가 + 는다 -> 간다)'],
  },
  {
    name: 'declarative present formal high',
    conjugation: '갑니다',
    type: 'declarative present',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '감니다',
    romanization: 'gahm-nee-dah',
    reasons: ['borrow padchim (가 + 습니다 -> 갑니다)'],
  },
  {
    name: 'declarative past informal low',
    conjugation: '갔어',
    type: 'declarative past',
    tense: 'PAST',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가써',
    romanization: 'gah-ssuh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
    ],
  },
  {
    name: 'declarative past informal high',
    conjugation: '갔어요',
    type: 'declarative past',
    tense: 'PAST',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가써요',
    romanization: 'gah-ssuh-yoh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
      'join (갔어 + 요 -> 갔어요)',
    ],
  },
  {
    name: 'declarative past formal low',
    conjugation: '갔다',
    type: 'declarative past',
    tense: 'PAST',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '가따',
    romanization: 'gah-ttah',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 다 -> 갔다)',
    ],
  },
  {
    name: 'declarative past formal high',
    conjugation: '갔습니다',
    type: 'declarative past',
    tense: 'PAST',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '가씀니다',
    romanization: 'gah-sseum-nee-dah',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 습니다 -> 갔습니다)',
    ],
  },
  {
    name: 'declarative future informal low',
    conjugation: '갈 거야',
    type: 'declarative future',
    tense: 'FUTURE',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '갈 거야',
    romanization: 'gahl- -guh-yah',
    reasons: ['borrow padchim (가 + 을 -> 갈)', 'join (갈 +  거야 -> 갈 거야)'],
  },
  {
    name: 'declarative future informal high',
    conjugation: '갈 거예요',
    type: 'declarative future',
    tense: 'FUTURE',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '갈 거예요',
    romanization: 'gahl- -guh-yae-yoh',
    reasons: [
      'borrow padchim (가 + 을 -> 갈)',
      'join (갈 +  거예요 -> 갈 거예요)',
    ],
  },
  {
    name: 'declarative future formal low',
    conjugation: '갈 거다',
    type: 'declarative future',
    tense: 'FUTURE',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '갈 거다',
    romanization: 'gahl- -guh-dah',
    reasons: ['borrow padchim (가 + 을 -> 갈)', 'join (갈 +  거다 -> 갈 거다)'],
  },
  {
    name: 'declarative future formal high',
    conjugation: '갈 겁니다',
    type: 'declarative future',
    tense: 'FUTURE',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '갈 검니다',
    romanization: 'gahl- -guhm-nee-dah',
    reasons: [
      'borrow padchim (가 + 을 -> 갈)',
      'join (갈 +  겁니다 -> 갈 겁니다)',
    ],
  },
  {
    name: 'determiner present',
    conjugation: '가는',
    type: 'determiner',
    tense: 'PRESENT',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '가는',
    romanization: 'gah-neun',
    reasons: ['join (가 + 는 -> 가는)'],
  },
  {
    name: 'determiner past',
    conjugation: '간',
    type: 'determiner',
    tense: 'PAST',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '간',
    romanization: 'gahn',
    reasons: ['borrow padchim (가 + 은 -> 간)'],
  },
  {
    name: 'determiner future',
    conjugation: '갈',
    type: 'determiner',
    tense: 'FUTURE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '갈',
    romanization: 'gahl',
    reasons: ['borrow padchim (가 + 을 -> 갈)'],
  },
  {
    name: 'imperative informal low',
    conjugation: '가',
    type: 'imperative',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
  {
    name: 'imperative informal high',
    conjugation: '가요',
    type: 'imperative',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가요',
    romanization: 'gah-yoh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
  },
  {
    name: 'imperative formal low',
    conjugation: '가라',
    type: 'imperative',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '가라',
    romanization: 'gah-rah',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 라 -> 가라)',
    ],
  },
  {
    name: 'imperative formal high',
    conjugation: '가십시오',
    type: 'imperative',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '가십씨오',
    romanization: 'gah-sheep-shee-oh',
    reasons: ['join (가 + 십시오 -> 가십시오)'],
  },
  {
    name: 'interrogative present informal low',
    conjugation: '가',
    type: 'interrogative present',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
  {
    name: 'interrogative present informal high',
    conjugation: '가요',
    type: 'interrogative present',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가요',
    romanization: 'gah-yoh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
  },
  {
    name: 'interrogative present formal low',
    conjugation: '가느냐',
    type: 'interrogative present',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '가느냐',
    romanization: 'gah-neu-nyah',
    reasons: ['join (가 + 느냐 -> 가느냐)'],
  },
  {
    name: 'interrogative present formal high',
    conjugation: '갑니까',
    type: 'interrogative present',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '감니까',
    romanization: 'gahm-nee-ggah',
    reasons: ['borrow padchim (가 + 습니까 -> 갑니까)'],
  },
  {
    name: 'interrogative past informal low',
    conjugation: '갔어',
    type: 'interrogative past',
    tense: 'PAST',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가써',
    romanization: 'gah-ssuh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
    ],
  },
  {
    name: 'interrogative past informal high',
    conjugation: '갔어요',
    type: 'interrogative past',
    tense: 'PAST',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가써요',
    romanization: 'gah-ssuh-yoh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 어 -> 갔어)',
      'join (갔어 + 요 -> 갔어요)',
    ],
  },
  {
    name: 'interrogative past formal low',
    conjugation: '갔느냐',
    type: 'interrogative past',
    tense: 'PAST',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '간느냐',
    romanization: 'gahn-neu-nyah',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 느냐 -> 갔느냐)',
    ],
  },
  {
    name: 'interrogative past formal high',
    conjugation: '갔습니까',
    type: 'interrogative past',
    tense: 'PAST',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '가씀니까',
    romanization: 'gah-sseum-nee-ggah',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 았 -> 갔)',
      'join (갔 + 습니까 -> 갔습니까)',
    ],
  },
  {
    name: 'nominal ing',
    conjugation: '감',
    type: 'verbal noun',
    tense: 'NONE',
    speechLevel: 'NONE',
    honorific: false,
    pronunciation: '감',
    romanization: 'gahm',
    reasons: ['borrow padchim (가 + 음 -> 감)'],
  },
  {
    name: 'propositive informal low',
    conjugation: '가',
    type: 'propositive',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가',
    romanization: 'gah',
    reasons: ['vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)'],
  },
  {
    name: 'propositive informal high',
    conjugation: '가요',
    type: 'propositive',
    tense: 'PRESENT',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가요',
    romanization: 'gah-yoh',
    reasons: [
      'vowel contraction [ㅏ ㅏ -> ㅏ] (가 + 아 -> 가)',
      'join (가 + 요 -> 가요)',
    ],
  },
  {
    name: 'propositive formal low',
    conjugation: '가자',
    type: 'propositive',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '가자',
    romanization: 'gah-chah',
    reasons: ['join (가 + 자 -> 가자)'],
  },
  {
    name: 'propositive formal high',
    conjugation: '갑시다',
    type: 'propositive',
    tense: 'PRESENT',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '갑씨다',
    romanization: 'gahp-shee-dah',
    reasons: ['borrow padchim (가 + 읍시다 -> 갑시다)'],
  },
  {
    name: 'suppositive informal low',
    conjugation: '가겠어',
    type: 'suppositive',
    tense: 'NONE',
    speechLevel: 'INFORMAL_LOW',
    honorific: false,
    pronunciation: '가게써',
    romanization: 'gah-gae-ssuh',
    reasons: ['join (가 + 겠어 -> 가겠어)'],
  },
  {
    name: 'suppositive informal high',
    conjugation: '가겠어요',
    type: 'suppositive',
    tense: 'NONE',
    speechLevel: 'INFORMAL_HIGH',
    honorific: false,
    pronunciation: '가게써요',
    romanization: 'gah-gae-ssuh-yoh',
    reasons: ['join (가 + 겠어요 -> 가겠어요)'],
  },
  {
    name: 'suppositive formal low',
    conjugation: '가겠다',
    type: 'suppositive',
    tense: 'NONE',
    speechLevel: 'FORMAL_LOW',
    honorific: false,
    pronunciation: '가게따',
    romanization: 'gah-gae-ttah',
    reasons: ['join (가 + 겠다 -> 가겠다)'],
  },
  {
    name: 'suppositive formal high',
    conjugation: '가겠습니다',
    type: 'suppositive',
    tense: 'NONE',
    speechLevel: 'FORMAL_HIGH',
    honorific: false,
    pronunciation: '가게씀니다',
    romanization: 'gah-gae-sseum-nee-dah',
    reasons: ['join (가 + 겠습니다 -> 가겠습니다)'],
  },
];

export const CONJUGATION_NAMES = [
  'connective if',
  'connective and',
  'connective but',
  'declarative present informal low',
  'declarative present informal high',
  'declarative present formal low',
  'declarative present formal high',
  'declarative past informal low',
  'declarative past informal high',
  'declarative past formal low',
  'declarative past formal high',
  'declarative future informal low',
  'declarative future informal high',
  'declarative future formal low',
  'declarative future formal high',
  'determiner present',
  'determiner past',
  'determiner future',
  'imperative informal low',
  'imperative informal high',
  'imperative formal low',
  'imperative formal high',
  'interrogative present informal low',
  'interrogative present informal high',
  'interrogative present formal low',
  'interrogative present formal high',
  'interrogative past informal low',
  'interrogative past informal high',
  'interrogative past formal low',
  'interrogative past formal high',
  'nominal ing',
  'propositive informal low',
  'propositive informal high',
  'propositive formal low',
  'propositive formal high',
  'suppositive informal low',
  'suppositive informal high',
  'suppositive formal low',
  'suppositive formal high',
];

export const CONJUGATION_TYPES = [
  'connective',
  'declarative present',
  'declarative past',
  'declarative future',
  'determiner',
  'imperative',
  'interrogative present',
  'interrogative past',
  'verbal noun',
  'propositive',
  'suppositive',
];

/**
 * Stems for "갈 거예요"
 */
export const STEMS = ['갈다', '갛다', '가다'];
