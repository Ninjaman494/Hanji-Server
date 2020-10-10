// vim: set ts=4 sw=4 expandtab
// (C) 2010 Dan Bravender - licensed under the AGPL 3.0

const hangeul       = require('./hangeul');
const pronunciation = require('./pronunciation');
const romanization  = require('./romanization');
const glob = require( 'glob' );
const path = require( 'path' );

// import and add conjugations
let conjugator = {};
let arr = glob.sync( __dirname + '/conjugations/*.js' );
arr.forEach( function( file ) {
    let conjugations = require( path.resolve( file ) );
    for(let c in conjugations){
        conjugator[c] = conjugations[c];
    }
});
arr = glob.sync( __dirname + '/conjugations/honorifics/*.js' );
arr.forEach( function( file ) {
    let conjugations = require( path.resolve( file ) );
    for(let c in conjugations){
        conjugator[c] = conjugations[c];
    }
});


conjugator.no_padchim_rule = function(characters) {
    /* no_padchim_rule is a helper function for defining merges where a
        character will take the padchim of a merged character if the first
        character doesn't already have a padchim, .e.g. 습 -> 가 + 습니다 -> 갑니다.
    */
    return function(x, y) {
        if (!hangeul.padchim(x.charAt(x.length-1)) && y[0] in characters) {
            return ['borrow padchim', x.substring(0, x.length-1) +
                                      hangeul.join(hangeul.lead(x[x.length-1]),
                                                   hangeul.vowel(x[x.length-1]),
                                                   hangeul.padchim(y[0])) +
                                      y.substring(1)];
        }
    }
};

conjugator.vowel_contraction = function(vowel1, vowel2, new_vowel, trace) {
    /* vowel contraction is a helper function for defining common contractions
       between a character without a padchim and a character that starts with
        'ᄋ', e.g. ㅐ + ㅕ -> ㅐ when applied to 해 + 였 yields 했.
    */
    return function(x, y) {
        if (hangeul.match(x.charAt(x.length-1), '*', vowel1, null) &&
            hangeul.match(y.charAt(0), 'ᄋ', vowel2, '*')) {
            return ['vowel contraction [' + vowel1 + ' ' + vowel2 + ' -> ' + new_vowel + ']',
                    x.substring(0, x.length-1) +
                    hangeul.join(hangeul.lead(x.charAt(x.length-1)),
                                 new_vowel,
                                 hangeul.padchim(y[0])) +
                    y.substring(1)];
        }
    }
};

conjugator.drop_l = function(x, y) {
    if (hangeul.padchim(x[x.length-1]) == 'ᆯ') {
        let stem = hangeul.join(hangeul.lead(x[x.length - 1]), hangeul.vowel(x[x.length - 1]));
        let conjugation = x.substring(0, x.length-1) + stem + y;
        conjugator.reasons.push(`drop ㄹ (${x} -> ${stem})`);
        conjugator.reasons.push(`join (${stem} + ${y} -> ${conjugation})`);
        return conjugation;
    }
};

conjugator.drop_l_and_borrow_padchim = function(x, y) {
    if (hangeul.padchim(x.charAt(x.length-1)) == 'ᆯ') {
        let stem = x.substring(0,x.length-1) + hangeul.join(hangeul.lead(x[x.length-1]),hangeul.vowel(x[x.length-1]));
        conjugator.reasons.push(`drop ㄹ (${x} -> ${stem})`);
        return conjugator.merge(stem, y);
    }
};

conjugator.dont_insert_eh = function(x, y) {
    if (hangeul.padchim(x.charAt(x.length-1)) == 'ᆯ' &&
        y[0] == '면') {
        return ['join', x + y];
    }
};

conjugator.insert_eh = function(characters) {
    return function(x, y) {
        if (hangeul.padchim(x.charAt(x.length-1)) && y[0] in characters) {
            return ['padchim + consonant -> insert 으', x + '으' + y];
        }
    }
};

conjugator.lm_merge = function(x, y) {
    if (hangeul.padchim(x.charAt(x.length-1)) == 'ᆯ' && y[0] == '음') {
        return ['ㄹ + ㅁ -> ᆱ',
                x.substring(0, x.length-1) +
                hangeul.join(hangeul.lead(x[x.length-1]),
                             hangeul.vowel(x[x.length-1]),
                             'ᆱ')];
    }
};

/* merge rules is a list of rules that are applied in order when merging a verb 
   stem with a tense ending
*/

conjugator.merge_rules = [
    conjugator.no_padchim_rule({'을': true, '습': true, '읍': true, '는': true, '음': true, '은':true}),
    conjugator.lm_merge,
    conjugator.vowel_contraction('ㅐ', 'ㅓ', 'ㅐ'),
    conjugator.vowel_contraction('ㅡ', 'ㅓ', 'ㅓ'),
    conjugator.vowel_contraction('ㅜ', 'ㅓ', 'ㅝ'),
    conjugator.vowel_contraction('ㅗ', 'ㅏ', 'ㅘ'),
    conjugator.vowel_contraction('ㅚ', 'ㅓ', 'ㅙ'),
    conjugator.vowel_contraction('ㅙ', 'ㅓ', 'ㅙ'),
    conjugator.vowel_contraction('ㅘ', 'ㅓ', 'ㅘ'),
    conjugator.vowel_contraction('ㅝ', 'ㅓ', 'ㅝ'),
    conjugator.vowel_contraction('ㅏ', 'ㅏ', 'ㅏ'),
    conjugator.vowel_contraction('ㅡ', 'ㅏ', 'ㅏ'),
    conjugator.vowel_contraction('ㅣ', 'ㅓ', 'ㅕ'),
    conjugator.vowel_contraction('ㅓ', 'ㅓ', 'ㅓ'),
    conjugator.vowel_contraction('ㅓ', 'ㅣ', 'ㅐ'),
    conjugator.vowel_contraction('ㅏ', 'ㅣ', 'ㅐ'),
    conjugator.vowel_contraction('ㅑ', 'ㅣ', 'ㅒ'),
    conjugator.vowel_contraction('ㅒ', 'ㅓ', 'ㅒ'),
    conjugator.vowel_contraction('ㅔ', 'ㅓ', 'ㅔ'),
    conjugator.vowel_contraction('ㅕ', 'ㅓ', 'ㅕ'),
    conjugator.vowel_contraction('ㅏ', 'ㅕ', 'ㅐ'),
    conjugator.vowel_contraction('ㅖ', 'ㅓ', 'ㅖ'),
    conjugator.vowel_contraction('ㅞ', 'ㅓ', 'ㅞ'),
    conjugator.dont_insert_eh,
    conjugator.insert_eh({'면': true, '세': true, '십': true, '셨': true, '실': true, '시': true}),
    // default rule
    function (x, y) {
        return ['join', x + y];
    }
];

conjugator.reasons = [];

conjugator.merge = function(x, y, noReasons = false) {
    /* concatenates every element in a list using the rules to
       merge the strings
    */
    var response = null;
    conjugator.merge_rules.forEach(function(rule) {
        if (!response) {
            output = rule(x, y);
            if (output) {
                if(!noReasons) {
                    conjugator.reasons.push((output[0] ? output[0] : '') + ' (' + x + ' + ' + y + ' -> ' + output[1] + ')');
                }
                response = output[1];
            }
        }
    });
    return response;
};

conjugator.both_regular_and_irregular = {
    '일': true, '곱': true, '파묻': false, '누르': true, '묻': true, '이르': true,
    '되묻': true, '썰': true, '붓': true, '들까불': true, '굽': true, '걷': true,
    '뒤까불': true, '까불': true
};

conjugator.regular_ees = {
    '가려보이': true, '가로놓이': true, '가로누이': true, '가로채이': true, '가리이': true, '간종이': true,
    '갈라붙이': true, '갈마들이': true, '갈붙이': true, '갈아들이': true, '갈아붙이': true, '감싸이': true,
    '갸울이': true, '거두어들이': true, '거둬들이': true, '거머들이': true, '건너다보이': true,
    '건중이': true, '걷어붙이': true, '걸머메이': true, '걸메이': true, '걸채이': true, '걸터들이': true,
    '겉뜨이': true, '겉절이': true, '겹쌓이': true, '곁들이': true, '곁붙이': true, '고이': true, '고이': true,
    '곤두박이': true, '곱꺾이': true, '곱놓이': true, '곱들이': true, '곱먹이': true, '공들이': true,
    '괴이': true, '괴이': true, '굽어보이': true, '굽죄이': true, '그러들이': true, '기울이': true,
    '기이': true, '기죽이': true, '길들이': true, '깃들이': true, '깊이': true, '까붙이': true, '까이': true,
    '깎이': true, '깎이': true, '깔보이': true, '깨이': true, '꺄울이': true, '꺼들이': true, '꺾이': true,
    '꼬이': true, '꼬이': true, '꼬이': true, '꼬이': true, '꼽들이': true, '꾀이': true, '꾸이': true,
    '꾸이': true, '꿰이': true, '끄숙이': true, '끄집어들이': true, '끊이': true, '끌어들이': true,
    '끓이': true, '끼울이': true, '끼이': true, '끼이': true, '나누이': true, '나덤벙이': true,
    '나번득이': true, '낚이': true, '낮보이': true, '내놓이': true, '내다보이': true, '내려다보이': true,
    '내려붙이': true, '내리덮이': true, '내리먹이': true, '내리쌓이': true, '내리쪼이': true,
    '내보이': true, '내보이': true, '내붙이': true, '넘겨다보이': true, '넘보이': true, '노느이': true,
    '녹이': true, '높이': true, '놓아먹이': true, '놓이': true, '누이': true, '누이': true, '누이': true,
    '누이': true, '누이': true, '눅이': true, '눈기이': true, '늘이': true, '늘이': true, '늘줄이': true,
    '다가붙이': true, '다붙이': true, '닦이': true, '닦이': true, '달이': true, '답쌓이': true,
    '덧끼이': true, '덧놓이': true, '덧덮이': true, '덧들이': true, '덧들이': true, '덧보이': true,
    '덧붙이': true, '덧쌓이': true, '덮싸이': true, '덮쌓이': true, '덮이': true, '데겅이': true,
    '도두보이': true, '돋보이': true, '돌려다붙이': true, '동이': true, '되박이': true, '되쓰이': true,
    '되치이': true, '둘러싸이': true, '뒤꼬이': true, '뒤놓이': true, '뒤덮이': true, '뒤바꾸이': true,
    '뒤방이': true, '뒤볶이': true, '뒤섞이': true, '뒤엎이': true, '드높이': true, '드러쌓이': true,
    '드러장이': true, '들뜨이': true, '들볶이': true, '들여다보이': true, '들이끼이': true,
    '들이끼이': true, '들이': true, '들이': true, '들이쌓이': true, '들이쌓이': true, '땋이': true,
    '때려누이': true, '때려죽이': true, '떠먹이': true, '떠벌이': true, '떠이': true, '떼이': true,
    '뜨이': true, '뜨이': true, '뜨이': true, '뜨이': true, '뜯어벌이': true, '맞놓이': true,
    '맞바라보이': true, '맞붙이': true, '맞아들이': true, '맞쪼이': true, '맡이': true,
    '매손붙이': true, '매이': true, '매이': true, '매이': true, '매조이': true, '먹이': true,
    '메다붙이': true, '메붙이': true, '메어붙이': true, '메이': true, '명씨박이': true,
    '모아들이': true, '모이': true, '몰아들이': true, '몰아붙이': true, '무이': true, '묶이': true,
    '물들이': true, '물어들이': true, '미이': true, '밀어붙이': true, '밀치이': true, '밉보이': true,
    '바꾸이': true, '바라보이': true, '박이': true, '박이': true, '받아들이': true, '발보이': true,
    '발붙이': true, '방이': true, '밭이': true, '밭이': true, '배꼬이': true, '배붙이': true,
    '배붙이': true, '번갈아들이': true, '벋놓이': true, '벌어들이': true, '벌이': true, '베이': true,
    '보이': true, '보이': true, '보쟁이': true, '보채이': true, '볶이': true, '부딪치이': true,
    '부레끓이': true, '부리이': true, '부치이': true, '불러들이': true, '불붙이': true, '붙동이': true,
    '붙매이': true, '붙박이': true, '붙이': true, '비꼬이': true, '비뚤이': true, '비추이': true,
    '빗놓이': true, '빗보이': true, '빨아들이': true, '뻗장이': true, '삐뚤이': true, '사들이': true,
    '사이': true, '삭이': true, '삭이': true, '생청붙이': true, '석이': true, '섞이': true, '선들이': true,
    '선보이': true, '설죽이': true, '속이': true, '숙이': true, '숨죽이': true, '쉬이': true, '싸이': true,
    '싸이': true, '쌓이': true, '썩이': true, '쏘아붙이': true, '쏘이': true, '쏘이': true, '쏴붙이': true,
    '쓰이': true, '쓰이': true, '쓰이': true, '쓰이': true, '알아방이': true, '애먹이': true,
    '야코죽이': true, '얕보이': true, '어녹이': true, '얼녹이': true, '얼보이': true, '얽동이': true,
    '얽매이': true, '얽섞이': true, '엇깎이': true, '엇누이': true, '엇바꾸이': true, '엇베이': true,
    '엇붙이': true, '엇섞이': true, '엎이': true, '에워싸이': true, '에이': true, '엮이': true,
    '열어붙이': true, '엿보이': true, '옥이': true, '옥조이': true, '옥죄이': true, '올려붙이': true,
    '옭매이': true, '옴츠러들이': true, '욕보이': true, '우러러보이': true, '우줅이': true, '욱이': true,
    '욱조이': true, '욱죄이': true, '움츠러들이': true, '윽죄이': true, '익삭이': true,
    '잡아들이': true, '장가들이': true, '쟁이': true, '절이': true, '접붙이': true, '접치이': true,
    '정들이': true, '정붙이': true, '조이': true, '졸이': true, '죄이': true, '죽이': true, '죽이': true,
    '줄이': true, '쥐이': true, '쥐이': true, '지이': true, '짓볶이': true, '짓죽이': true, '짜이': true,
    '쪼이': true, '쪼이': true, '쪼이': true, '쬐이': true, '차이': true, '처들이': true, '처먹이': true,
    '처쟁이': true, '쳐다보이': true, '추이': true, '축이': true, '충이': true, '치먹이': true,
    '치쌓이': true, '치이': true, '치이': true, '치이': true, '치이': true, '치이': true, '치이': true,
    '치이': true, '켜이': true, '트이': true, '파이': true, '펴이': true, '풀어먹이': true, '할퀴이': true,
    '핥이': true, '핥이': true, '헛놓이': true, '헛보이': true, '헛짚이': true, '헝클이': true,
    '홀라들이': true, '홅이': true, '훌닦이': true, '훌라들이': true, '훑이': true, '휘덮이': true,
    '휘어붙이': true, '휩싸이': true, '흘레붙이': true, '흙들이': true, '흩이': true, '힘들이': true,
    '모이': true
}

conjugator.not_p_irregular = {'털썩이잡': true, '넘겨잡': true, '우접': true, '입': true, '맞접': true, '문잡': true, '다잡': true, '까뒤집': true, '배좁': true, '목잡': true, '끄집': true, '잡': true, '옴켜잡': true, '검잡': true, '되순라잡': true, '내씹': true, '모집': true, '따잡': true, '엇잡': true, '까집': true, '겹집': true, '줄통뽑': true, '버르집': true, '지르잡': true, '추켜잡': true, '업': true, '되술래잡': true, '되접': true, '좁디좁': true, '더위잡': true, '말씹': true, '내뽑': true, '집': true, '걸머잡': true, '휘어잡': true, '꿰입': true, '황잡': true, '에굽': true, '내굽': true, '따라잡': true, '맞뒤집': true, '둘러업': true, '늘잡': true, '끄잡': true, '우그려잡': true, '어줍': true, '언걸입': true, '들이곱': true, '껴잡': true, '곱 접': true, '훔켜잡': true, '늦추잡': true, '갈아입': true, '친좁': true, '희짜뽑': true, '마음잡': true, '개미잡': true, '옴씹': true, '치잡': true, '그러잡': true, '움켜잡': true, '씹': true, '비집': true, '꼽': true, '살잡': true, '죄입': true, '졸잡': true, '가려잡': true, '뽑': true, '걷어잡': true, '헐잡': true, '돌라입': true, '덧잡': true, '얕잡': true, '낫잡': true, '부여잡': true, '맞붙잡': true, '걸입': true, '주름잡': true, '걷어입': true, '빌미잡': true, '개잡': true, '겉잡': true, '안쫑잡': true, '좁': true, '힘입': true, '걷잡': true, '바르집': true, '감씹': true, '짓씹': true, '손잡': true, '포집': true, '붙잡': true, '낮잡': true, '책잡': true, '곱잡': true, '흉잡': true, '뒤집': true, '땡잡': true, '어림잡': true, '덧껴입': true, '수줍': true, '뒤잡': true, '꼬집': true, '예굽': true, '덮쳐잡': true, '헛잡': true, '되씹': true, '낮추잡': true, '날파람잡': true, '틀어잡': true, '헤집': true, '남의달잡': true, '바로잡': true, '흠잡': true, '파잡': true, '얼추잡': true, '손꼽': true, '접': true, '차려입': true, '골라잡': true, '거머잡': true, '후려잡': true, '머줍': true, '넉장뽑': true, '사로잡': true, '덧입': true, '껴입': true, '얼입': true, '우집': true, '설잡': true, '늦잡': true, '비좁': true, '고르잡': true, '때려잡': true, '떼집': true, '되잡': true, '홈켜잡': true, '내곱': true, '곱씹': true, '빼입': true, '들이굽': true, '새잡': true, '이르집': true, '떨쳐입': true};

conjugator.not_s_irregular = {'내솟': true, '빗': true, '드솟': true, '비웃': true, '뺏': true, '샘솟': true, '벗': true, '들이웃': true, '솟': true, '되뺏': true, '빼앗': true, '밧': true, '애긋': true, '짜드라웃': true, '어그솟': true, '들솟': true, '씻': true, '빨가벗': true, '깃': true, '벌거벗': true, '엇': true, '되빼앗': true, '웃': true, '앗': true, '헐벗': true, '용솟': true, '덧솟': true, '발가벗': true, '뻘거벗': true, '날솟': true, '치솟': true};

conjugator.not_d_irregular = {'맞받': true, '내딛': true, '내리받': true, '벋': true, '뒤닫': true, '주고받': true, '공얻': true, '무뜯': true, '물어뜯': true, '여닫': true, '그러묻': true, '잇닫': true, '덧묻': true, '되받': true, '뻗': true, '올리닫': true, '헐뜯': true, '들이닫': true, '활걷': true, '겉묻': true, '닫': true, '창받': true, '건네받': true, '물손받': true, '들이받': true, '강요받': true, '내리벋': true, '받': true, '이어받': true, '부르걷': true, '응받': true, '검뜯': true, '인정받': true, '내려딛': true, '내쏟': true, '내리뻗': true, '너름받': true, '세받': true, '내 돋': true, '돌려받': true, '쥐어뜯': true, '껴묻': true, '본받': true, '뒤받': true, '강종받': true, '내리닫': true, '떠받': true, '테받': true, '내받': true, '흠뜯': true, '두남받': true, '치받': true, '부르돋': true, '대받': true, '설굳': true, '처닫': true, '얻': true, '들이돋': true, '돋': true, '죄받': true, '쏟': true, '씨받': true, '딱장받': true, '치걷': true, '믿': true, '치벋': true, '버림받': true, '북돋': true, '딛': true, '치고받': true, '욱걷': true, '물려받': true, '뜯': true, '줴뜯': true, '넘겨받': true, '안받': true, '내뻗': true, '내리쏟': true, '벋딛': true, '뒤묻': true, '뻗딛': true, '치뻗': true, '치닫': true, '줄밑걷': true, '굳': true, '내닫': true, '내림받': true};

conjugator.not_h_irregular = {'들이좋': true, '터놓': true, '접어놓': true, '좋': true, '풀어놓': true, '내쌓': true, '꼴좋': true, '치쌓': true, '물어넣': true, '잇닿': true, '끝닿': true, '그러넣': true, '뽕놓': true, '낳': true, '내리찧': true, '힘닿': true, '내려놓': true, '세놓': true, '둘러놓': true, '들놓': true, '맞찧': true, '잡아넣': true, '돌라쌓': true, '덧쌓': true, '갈라땋': true, '주놓': true, '갈라놓': true, '들이닿': true, '집어넣': true, '닿': true, '의좋': true, '막놓': true, '내놓': true, '들여놓': true, '사놓': true, '썰레놓': true, '짓찧': true, '벋놓': true, '찧': true, '침놓': true, '들이찧': true, '둘러쌓': true, '털어놓': true, '담쌓': true, '돌라놓': true, '되잡아넣': true, '끌어넣': true, '덧놓': true, '맞닿': true, '처넣': true, '빻': true, '뻥놓': true, '내리쌓': true, '곱놓': true, '설레발놓': true, '우겨넣': true, '놓': true, '수놓': true, '써넣': true, '널어놓': true, '덮쌓': true, '연닿': true, '헛놓': true, '돌려놓': true, '되쌓': true, '욱여넣': true, '앗아넣': true, '올려놓': true, '헛방놓': true, '날아놓': true, '뒤놓': true, '업수놓': true, '가로놓': true, '맞놓': true, '펴놓': true, '내켜놓': true, '쌓': true, '끙짜놓': true, '들이쌓': true, '겹쌓': true, '기추놓': true, '넣': true, '불어넣': true, '늘어놓': true, '긁어놓': true, '어긋놓': true, '앞넣': true, '눌러놓': true, '땋': true, '들여쌓': true, '빗놓': true, '사이좋': true, '되놓': true, '헛불놓': true, '몰아넣': true, '먹놓': true, '밀쳐놓': true, '살닿': true, '피새놓': true, '빼놓': true, '하차놓': true, '틀어넣': true};

conjugator.not_l_euh_irregular = {'우러르': true, '따르': true, '붙따르': true, '늦치르': true, '다다르': true, '잇따르': true, '치르': true};

conjugator.not_l_irregular = {};

conjugator.after_last_space = function(infinitive) {
    return infinitive.split(' ').reverse()[0];
};

conjugator.is_s_irregular = function(infinitive, regular) {
    if (regular) {
        return false;
    }
    return hangeul.match(infinitive.charAt(infinitive.length-1), '*', '*', 'ᆺ') &&
           !(conjugator.after_last_space(infinitive) in conjugator.not_s_irregular);
};


conjugator.is_l_irregular = function(infinitive, regular) {
    if (regular) {
        return false;
    }
    return hangeul.match(infinitive.charAt(infinitive.length-1), '*', '*', 'ᆯ') &&
           !(conjugator.after_last_space(infinitive) in conjugator.not_l_irregular);
}

conjugator.is_l_euh_irregular = function(infinitive, regular) {
    if (regular) {
        return false;
    }
    return hangeul.match(infinitive.charAt(infinitive.length-1), 'ᄅ', 'ㅡ', null) &&
           !(conjugator.after_last_space(infinitive) in conjugator.not_l_euh_irregular);
};

conjugator.is_h_irregular = function(infinitive, regular) {
    if (regular) {
        return false;
    }
    return (hangeul.padchim(infinitive.charAt(infinitive.length-1)) == 'ᇂ' ||
           infinitive.charAt(infinitive.length-1) == '러') &&
           !(conjugator.after_last_space(infinitive) in conjugator.not_h_irregular);
};

conjugator.is_p_irregular = function(infinitive, regular) {
    if (regular) {
        return false;
    }
    return hangeul.match(infinitive.charAt(infinitive.length-1), '*', '*', 'ᆸ') &&
           !(conjugator.after_last_space(infinitive) in conjugator.not_p_irregular);
};

conjugator.is_d_irregular = function(infinitive, regular) {
    if (regular) {
        return false;
    }
    return hangeul.match(infinitive.charAt(infinitive.length-1), '*', '*', 'ᆮ') &&
           !(conjugator.after_last_space(infinitive) in conjugator.not_d_irregular);
};

conjugator.join = function(x, y){
    conjugator.reasons.push(`join (${x} + ${y} -> ${x + y})`);
    return x + y;
};

conjugator.verb_types = {
    'ㅅ 불규칙 동사 (irregular verb)': conjugator.is_s_irregular,
    'ㄹ 불규칙 동사 (irregular verb)': conjugator.is_l_irregular,
    '르 불규칙 동사 (irregular verb)': conjugator.is_l_euh_irregular,
    'ㅎ 불규칙 동사 (irregular verb)': conjugator.is_h_irregular,
    'ㅂ 불규칙 동사 (irregular verb)': conjugator.is_p_irregular,
    'ㄷ 불규칙 동사 (irregular verb)': conjugator.is_d_irregular
};

conjugator.verb_type = function(infinitive, regular) {
    if (regular) {
        return 'regular verb';
    }
    for (irregular_name in conjugator.verb_types) {
        func = conjugator.verb_types[irregular_name];
        if (func(conjugator.base(infinitive))) {
            return irregular_name;
        }
    }
    return 'regular verb';
}

conjugator.base = function(infinitive, regular) {
    if (infinitive.charAt(infinitive.length-1) == '다') {
        return infinitive.substring(0, infinitive.length-1);
    } else {
        return infinitive;
    }
};

conjugator.base2 = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);

    if (infinitive == '아니') {
        infinitive = new hangeul.Geulja('아니');
        infinitive.hidden_padchim = true;
        return infinitive;
    }
    if (infinitive == '뵙') {
        return '뵈';
    }
    if (infinitive == '푸') {
        return '퍼';
    }

    new_infinitive = infinitive;
    let x = infinitive.substring(0, infinitive.length-1) +
        hangeul.join(hangeul.lead(infinitive.charAt(infinitive.length-1)),
            hangeul.vowel(infinitive.charAt(infinitive.length-1)));

    if (conjugator.is_h_irregular(infinitive, regular)) {
        new_infinitive = conjugator.merge(x, '이', true);
        conjugator.reasons.push('ㅎ irregular (' + infinitive + ' -> ' + new_infinitive + ')');
    } else if (conjugator.is_p_irregular(infinitive, regular)) {
        // only some verbs get ㅗ (highly irregular)
        if (infinitive in {'묻잡': true} ||
            infinitive.charAt(infinitive.length-1) in {'돕': true, '곱': true}) {
            new_vowel = 'ㅗ';
        } else {
            new_vowel = 'ㅜ';
        }
        new_infinitive = conjugator.merge(x, hangeul.join('ᄋ', new_vowel), true);
        conjugator.reasons.push('ㅂ irregular (' + infinitive + ' -> ' + new_infinitive + ')');
    } else if (conjugator.is_d_irregular(infinitive, regular)) {
        new_infinitive = new hangeul.Geulja(infinitive.substring(0, infinitive.length-1) +
                                            hangeul.join(hangeul.lead(infinitive.charAt(infinitive.length-1)),
                                            hangeul.vowel(infinitive.charAt(infinitive.length-1)),
                                             'ᆯ'));
        new_infinitive.original_padchim = 'ᆮ';
        conjugator.reasons.push('ㄷ irregular (' + infinitive + ' -> ' + new_infinitive + ')');
    } else if (conjugator.is_s_irregular(infinitive, regular)) {
        new_infinitive = new hangeul.Geulja(x);
        new_infinitive.hidden_padchim = true;
        conjugator.reasons.push('ㅅ irregular (' + infinitive + ' -> ' + new_infinitive + ' [hidden padchim])');
    }
    return new_infinitive;
};

conjugator.base3 = function(infinitive, regular) {
    infinitive = conjugator.base(infinitive, regular);
    if (infinitive == '아니') {
        return '아니';
    }
    if (infinitive == '푸') {
        return '푸';
    }
    if (infinitive == '뵙') {
        return '뵈';
    }
    if (conjugator.is_h_irregular(infinitive, regular)) {
        return infinitive.substring(0, infinitive.length-1) +
               hangeul.join(hangeul.lead(infinitive.charAt(infinitive.length-1)),
                            hangeul.vowel(infinitive.charAt(infinitive.length-1)))
    } else if (conjugator.is_p_irregular(infinitive, regular)) {
        return infinitive.substring(0, infinitive.length-1) +
               hangeul.join(hangeul.lead(infinitive.charAt(infinitive.length-1)),
                            hangeul.vowel(infinitive.charAt(infinitive.length-1))) + '우';
    } else {
        return conjugator.base2(infinitive, regular);
    }
};

conjugator.past_base = function(infinitive, regular) {
    ps = conjugator.declarative_present_informal_low(infinitive, regular, true);
    if (hangeul.find_vowel_to_append(ps) == '아') {
        return conjugator.merge(ps, '았');
    } else {
        return conjugator.merge(ps, '었');
    }
};
conjugator.past_base.conjugation = false;

conjugator.future_base = function(infinitive, regular) {
    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l_and_borrow_padchim(conjugator.base3(infinitive, regular), '을');
    }
    return conjugator.merge(conjugator.base3(infinitive, regular), '을');
};
conjugator.future_base.conjugation = false;

conjugator.add_honorific =  function(infinitive,regular){
    if (conjugator.is_l_irregular(conjugator.base(infinitive, regular))) {
        return conjugator.drop_l(conjugator.base3(infinitive, regular), '시');
    }else{
        return conjugator.merge(conjugator.base3(infinitive,regular),'시');
    }
};

conjugator.is_itda_obda = function(infinitive,regular){
    let stem = conjugator.base(infinitive, regular);
    return stem.charAt(stem.length - 1) == '있' || stem.charAt(stem.length - 1) == '없';
};

conjugator.display_conjugations = function(infinitive, regular, callback) {
    var both_regular_and_irregular = false;
    infinitive = conjugator.base(infinitive, regular);
    out = '';
    if (infinitive in conjugator.both_regular_and_irregular) {
        both_regular_and_irregular = true;
        out += '<dd class="warning">warning</dd>';
        out += '<dt>This verb has both regular and irregular forms.</dt>';
    }
    out += '<div class="conjugation"><dd>verb type</dd>';
    out += '<dt>' + conjugator.verb_type(infinitive, regular)
    if (both_regular_and_irregular) {
        out += ' <button id="form-change">view ' + (regular ? 'irregular' : 'regular') + ' form</button>';
    }
    out += '</dt></div>';
    for (conjugation in conjugator) {
        conjugator.reasons = [];
        if (conjugator[conjugation].conjugation) {
            out += '<div class="conjugation"><dd>' + conjugation.replace(/_/g, ' ') + '</dd>';
            var conjugated = conjugator[conjugation](infinitive, regular);
            var pron = pronunciation.get_pronunciation(conjugated);
            var romanized = romanization.romanize(pron);
            out += '<dt>' + conjugated + ' <button class="show-reasons">↴</button></dt>';
            out += '<ul class="reasons">';
            out += '<li>pronunciation [' + (pron != conjugated ? (pron + ' / ') : '') + romanized + ']</li>';
            for (reason in conjugator.reasons) {
                out += '<li>' + conjugator.reasons[reason] + '</li>';
            }
            out += '</ul></div>';
        }
    }
    callback(out);
};

conjugator.each_conjugation = function(infinitive, regular, isAdj, honorific, callback) {
    infinitive = conjugator.base(infinitive, regular);
    for (conjugation in conjugator) {
        conjugator.reasons.length = 0;
        if (conjugator[conjugation].conjugation && (honorific == conjugator[conjugation].honorific || (!honorific && conjugator[conjugation].honorific == null))) {
            var r = {};
            r.conjugated = conjugator[conjugation](infinitive, regular, isAdj,honorific);
            if(r.conjugated == undefined){ // this conjugation doesn't exist for this word (ex. determiner past for adj.)
                continue;
            }

            r.infinitive = infinitive + '다';
            r.conjugation_name = conjugation.replace(/_/g, ' ').replace(' honorific','');
            r.pronunciation = pronunciation.get_pronunciation(r.conjugated);
            r.romanized = romanization.romanize(r.pronunciation);
            r.reasons = [];
            for (reason in conjugator.reasons) {
                r.reasons.push(conjugator.reasons[reason]);
            }

            r.type = conjugator[conjugation].type;
            r.tense = conjugator[conjugation].tense;
            r.speechLevel = conjugator[conjugation].speechLevel;
            r.honorific = conjugator[conjugation].honorific ? conjugator[conjugation].honorific : false ; // should be set to false if undefined

            callback(r);
        }
    }
};

conjugator.conjugate = function(infinitive, regular, isAdj, honorific, callback) {
    var conjugations = [];
    conjugator.each_conjugation(infinitive, regular, isAdj, honorific, function(result) {
        conjugations.push(result);
    });
    callback(conjugations);
};

conjugator.conjugate_json = function(infinitive, regular, callback) {
    conjugator.conjugate(infinitive, regular, function(result) {
        result.unshift({
            'type': 'both_regular_and_irregular',
            'value': conjugator.base(infinitive) in conjugator.both_regular_and_irregular
        });
        result.unshift({
            'type': 'verb_type',
            'value': conjugator.verb_type(infinitive, regular)
        });
        callback(JSON.stringify(result));
    });
};

conjugator.getTypes = function() {
  let types = new Set();
  for(conjugation in conjugator) {
      if (conjugator[conjugation].conjugation) {
          types.add(conjugator[conjugation].type);
      }
  }
  return types;
};

conjugator.getNames = function() {
    let names = new Set();
    for(conjugation in conjugator) {
        if(conjugator[conjugation].conjugation) {
            names.add(conjugation.replace(/_/g, ' ').replace(' honorific',''));
        }
    }
    return names;
};

// Export functions to node
try {
    for (f in conjugator) {
        exports[f] = conjugator[f];
    }
} catch(e) {}