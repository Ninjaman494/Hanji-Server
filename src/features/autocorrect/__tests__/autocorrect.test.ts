import { editOneLetter } from '../autocorrect';
import { INSERT_KA, REPLACE_KA } from './snapshots';

describe('autocorrect functions', () => {
  describe('editOneLetter function', () => {
    it('generates one letter edits', () => {
      const edits = editOneLetter('ㄱㅏ');
      const expectedEdits = new Set(['ㄱ', 'ㅏ', ...INSERT_KA, ...REPLACE_KA]);
      expectedEdits.delete('ㄱㅏ');

      expect(edits).toEqual(expectedEdits);
    });
  });
});
