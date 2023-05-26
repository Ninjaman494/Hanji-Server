import { editOneLetter, editTwoLetter } from '../autocorrect';
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
});
