import { generateUuid } from './generate-uuid';

describe('generateUuid', () => {
  it('should not generate the same id twice', () => {
    expect(generateUuid()).not.toEqual(generateUuid());
  });
});
