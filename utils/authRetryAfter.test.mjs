import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_SMS_RESEND_SECONDS, smsResendSeconds } from './authRetryAfter.mjs';

test('берёт retry_after из ответа бэкенда', () => {
  assert.equal(smsResendSeconds({ st: true, retry_after: 90 }), 90);
  assert.equal(smsResendSeconds({ st: true, retry_after: 300 }), 300);
  assert.equal(smsResendSeconds({ st: true, retry_after: '180' }), 180);
});

test('без валидного retry_after — прежние 89 секунд', () => {
  for (const json of [undefined, null, {}, { retry_after: 0 }, { retry_after: -5 }, { retry_after: 'later' }, { retry_after: 1.5 }]) {
    assert.equal(smsResendSeconds(json), DEFAULT_SMS_RESEND_SECONDS);
  }
});
