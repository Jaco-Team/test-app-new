import { describe, expect, it } from 'vitest';
import { isValidCafeFeedbackToken } from './cafeFeedbackToken.mjs';

describe('cafe feedback route tokens', () => {
  it('accepts configured short QR codes', () => {
    expect(isValidCafeFeedbackToken('abcde28956')).toBe(true);
  });

  it('keeps accepting legacy long tokens', () => {
    expect(isValidCafeFeedbackToken('a'.repeat(32))).toBe(true);
  });

  it('rejects malformed and too-short tokens', () => {
    expect(isValidCafeFeedbackToken('abc')).toBe(false);
    expect(isValidCafeFeedbackToken('abcde2345!')).toBe(false);
  });
});
