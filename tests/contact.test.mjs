import assert from 'node:assert/strict';
import test from 'node:test';
import { contactEndpoint, submitInquiry } from '../src/contact.js';
import { email } from '../src/data.js';

function inquiry() {
  const fields = new FormData();
  fields.set('name', ' Test Visitor ');
  fields.set('email', 'visitor@example.org');
  fields.set('project', 'Brand film');
  fields.set('message', 'Please send a project estimate.');
  return fields;
}

test('sends the visitor fields and subject to the configured recipient without an email client', async () => {
  let calls = 0;
  const result = await submitInquiry(inquiry(), async (url, options) => {
    calls++;
    assert.equal(url, `https://formsubmit.co/ajax/${email}`);
    assert.equal(url, contactEndpoint);
    assert.equal(options.method, 'POST');
    const body = JSON.parse(options.body);
    assert.equal(body.name, 'Test Visitor');
    assert.equal(body.email, 'visitor@example.org');
    assert.equal(body.message, 'Please send a project estimate.');
    assert.equal(body._subject, 'Portfolio inquiry: Brand film');
    assert.equal(body._template, 'table');
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: true, json: async () => ({ success: 'true' }) };
  });
  assert.equal(calls, 1);
  assert.equal(result.ignored, false);
});

test('HTTP and service-level errors never report success', async () => {
  for (const response of [
    { ok: false, json: async () => ({ success: true }) },
    { ok: true, json: async () => ({ success: 'false' }) },
    { ok: true, json: async () => ({}) },
  ]) await assert.rejects(submitInquiry(inquiry(), async () => response));
  await assert.rejects(submitInquiry(inquiry(), async () => { throw new TypeError('Network error'); }));
  await assert.rejects(submitInquiry(inquiry(), async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } })));
});

test('spam trap and missing required fields do not reach the provider', async () => {
  const unexpectedRequest = async () => { assert.fail('Should not send'); };
  const spam = inquiry();
  spam.set('_honey', 'spam');
  assert.equal((await submitInquiry(spam, unexpectedRequest)).ignored, true);
  const missing = inquiry();
  missing.set('message', '  ');
  await assert.rejects(submitInquiry(missing, unexpectedRequest), /Please enter/);
});
