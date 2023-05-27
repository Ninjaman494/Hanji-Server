jest.mock('fs');

import { readFileSync } from 'fs';
import { generateDict } from '../generateDict';

describe('generateDict', () => {
  it('generates a dictionary given a corpus', () => {
    (readFileSync as jest.Mock).mockReturnValue(
      '그	그/MM	그/Determiner	80726\n있는	있/VX+는/ETM	있/Verb+는/Eomi	28946\n것이다	것/NNB+이/VCP+다/EF+./SF	것/Noun+이/Adjective+다/Eomi	37808',
    );

    const dict = generateDict('fakepath');
    expect(dict).toEqual(
      new Map([
        ['ㄱㅡ', [80726, '그']],
        ['ㅇㅣㅆㄴㅡㄴ', [28946, '있는']],
        ['ㄱㅓㅅㅇㅣㄷㅏ', [37808, '것이다']],
      ]),
    );
  });

  it('trims out punctuation and non-hangul characters', () => {
    (readFileSync as jest.Mock).mockReturnValue(
      '"수술하는	"/SS+수술/NNG+하/XSV+는/ETM	수술/Noun+하/Verb+는/Eomi	1\n' +
        '것이다.	것/NNB+이/VCP+다/EF+./SF	것/Noun+이/Adjective+다/Eomi	37808\n' +
        '나태(懶怠)를	나태/NNG+(/SS+懶怠/SH+)/SS+를/JKO	나태/Noun+를/Josa	1\n' +
        '0.25%에서	0/SN+./SF+25/SN+%/SW+에서/JKB	025/Noun+에서/Josa	2',
    );

    const dict = generateDict('fakepath');
    expect(dict).toEqual(
      new Map([
        ['ㅅㅜㅅㅜㄹㅎㅏㄴㅡㄴ', [1, '수술하는']],
        ['ㄱㅓㅅㅇㅣㄷㅏ', [37808, '것이다']],
        ['ㄴㅏㅌㅐ', [1, '나태']],
        ['ㅇㅔㅅㅓ', [2, '에서']],
      ]),
    );
  });

  it('combines multiple entries', () => {
    (readFileSync as jest.Mock).mockReturnValue(
      '있다.	있/VX+다/EF+./SF	있/Verb+다/Eomi	30548\n' +
        '있다.	있/VV+다/EF+./SF	있/Verb+다/Eomi	26195',
    );

    const dict = generateDict('fakepath');
    expect(dict).toEqual(new Map([['ㅇㅣㅆㄷㅏ', [56743, '있다']]]));
  });

  it('breaks down double letter padchims', () => {
    (readFileSync as jest.Mock).mockReturnValue(
      '없다	없/VX+다/EF+./SF	있/Verb+다/Eomi	30548',
    );

    const dict = generateDict('fakepath');
    expect(dict).toEqual(new Map([['ㅇㅓㅂㅅㄷㅏ', [30548, '없다']]]));
  });
});
