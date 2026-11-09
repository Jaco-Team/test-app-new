import assert from 'node:assert/strict';
import test from 'node:test';
import IMask from 'imask';

import { prepareRussianPhoneInput } from './phoneMask.mjs';

function formatPhone(value) {
  const mask = IMask.createMask({
    mask: '8 (000) 000-00-00',
    overwrite: true,
    prepare: prepareRussianPhoneInput,
  });

  mask.resolve(value);

  return mask.value;
}

test('normalizes Russian autocomplete and paste formats without dropping the last digit', () => {
  for (const value of [
    '+7 921 346-30-70',
    '7 (921) 346-30-70',
    '8 (921) 346-30-70',
    '921 346-30-70',
  ]) {
    assert.equal(formatPhone(value), '8 (921) 346-30-70');
  }
});

test('limits accidental extra input after prefix normalization', () => {
  assert.equal(formatPhone('+7 921 346-30-701'), '8 (921) 346-30-70');
});

test('preserves incremental masked input', () => {
  assert.equal(prepareRussianPhoneInput('921'), '921');
});
