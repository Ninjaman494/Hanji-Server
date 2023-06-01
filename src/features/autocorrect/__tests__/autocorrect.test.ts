import {
  editOneLetter,
  editTwoLetter,
  findCorrection,
  initAutoCorrectVocab,
} from '../autocorrect';
import { INSERT_KA, REPLACE_KA } from './snapshots';

describe('autocorrect functions', () => {
  it('editOneLetter generates one letter edits', () => {
    const edits = editOneLetter('ㄱㅏ');
    const expectedEdits = new Set(['ㄱ', 'ㅏ', ...INSERT_KA, ...REPLACE_KA]);
    expectedEdits.delete('ㄱㅏ');

    expect(edits).toEqual(expectedEdits);
  });

  it('editTwoLetter generates two letter edits', () => {
    const edits = editTwoLetter('ㄱ');

    // Full set is way too large
    expect(edits.has('ㄱㄱㅏ')).toBeTruthy();
    expect(edits.has('ㅎㄱㅏ')).toBeTruthy();
    expect(edits.has('ㄱㄱㅣ')).toBeTruthy();
    expect(edits.has('ㄱㅎㅣ')).toBeTruthy();
    expect(edits.has('ㅞㅎ')).toBeTruthy();
  });

  describe('findCorrection', () => {
    beforeAll(initAutoCorrectVocab);

    it('autocorrects Korean queries', () => {
      const correction = findCorrection('갑시디');
      expect(correction).toEqual('갑시다');
    });

    it('handles extra jamo', () => {
      const correction = findCorrection('있어ㅛ');
      expect(correction).toEqual('있어');
    });

    it('handles double letter padchims', () => {
      const correction = findCorrection('읿어요');
      expect(correction).toEqual('읽어요');
    });

    it('does not correct valid queries', () => {
      const correction = findCorrection('드세요');
      expect(correction).toEqual('드세요');
    });

    it('returns null when there is no correction', () => {
      const correction = findCorrection('갈 거시다');
      expect(correction).toBeNull();
    });
  });
});
