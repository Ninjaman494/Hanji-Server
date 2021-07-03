import { romanize } from '../korean/romanization';

describe('romanization functions', () => {
  test('general romanization', () => {
    [
      ['안녕', 'ahn-nyuhng'],
      ['시간', 'shee-gahn'],
      ['축구', 'choog-ggoo'],
      ['야구', 'yah-goo'],
      ['탁구', 'tahg-ggoo'],
      ['김치', 'geem-chee'],
      ['원숭이', 'wuhn-soong-ee'],
      ['댄', 'daen'],
      ['강남', 'gahng-nahm'],
      ['수연', 'soo-yuhn'],
      ['숭실', 'soong-sheel'],
      ['열쇠', 'yuhl-swae'],
      ['참치', 'chahm-chee'],
      ['양파', 'yahng-pah'],
      ['괜잖아', 'gwaen-chahn-ah'],
      ['이따 봐', 'ee-ttah- -bwah'],
      ['없어', 'uhp-ssuh'],
      ['합니다', 'hahm-nee-dah'],
      ['합시다', 'hahp-shee-dah'],
      ['먹을거야', 'muh-geul-guh-yah'],
      ['슈퍼', 'shyoo-puh'],
    ].forEach(function (test_data) {
      const input = test_data[0];
      const expected = test_data[1];
      expect(romanize(input)).toEqual(expected);
    });
  });
});
