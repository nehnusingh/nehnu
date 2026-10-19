import { email } from './data.js';

export const contactAction = `https://formsubmit.co/${email}`;
export const contactEndpoint = `https://formsubmit.co/ajax/${email}`;

export async function submitInquiry(fields, fetchRequest = fetch) {
  // Do not send submissions that filled the hidden spam trap.
  if (String(fields.get('_honey') || '').trim()) return { ignored: true };
  const payload = {
    name: String(fields.get('name') || '').trim(),
    email: String(fields.get('email') || '').trim(),
    project: String(fields.get('project') || '').trim(),
    message: String(fields.get('message') || '').trim(),
    _honey: '',
    _template: 'table',
  };
  if (!payload.name || !payload.email || !payload.message) {
    throw new Error('Please enter your name, email, and project message.');
  }
  payload._subject = `Portfolio inquiry: ${payload.project || 'New project'}`;
  const response = await fetchRequest(contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  const result = await response.json();
  if (!response.ok || (result.success !== true && result.success !== 'true')) {
    throw new Error('The form service could not accept your message. Please try again or email me directly.');
  }
  return { ignored: false };
}
