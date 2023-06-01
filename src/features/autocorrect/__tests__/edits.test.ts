import { deleteJamo, insertJamo, replaceJamo } from '../edits';
import { INSERT_KA, REPLACE_KA } from './snapshots';

describe('edit functions', () => {
  describe('deleteJamo', () => {
    it('creates possible words with one jamo deleted', () => {
      const actual = deleteJamo('ㄱㅏㅂㅅㅣ');
      expect(actual).toEqual(
        new Set(['ㅏㅂㅅㅣ', 'ㄱㅂㅅㅣ', 'ㄱㅏㅅㅣ', 'ㄱㅏㅂㅣ', 'ㄱㅏㅂㅅ']),
      );
    });
  });

  describe('insertJamo', () => {
    it('creates possible words with one jamo inserted', () => {
      const actual = insertJamo('ㄱㅏ');
      expect(actual).toEqual(new Set(INSERT_KA));
    });
  });

  describe('replaceJamo', () => {
    it('creates possible words with one jamo replaced', () => {
      const actual = replaceJamo('ㄱㅏ');
      expect(actual).toEqual(new Set(REPLACE_KA));
    });
  });
});
