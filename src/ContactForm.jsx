import { useRef, useState } from 'react';
import { contactAction, submitInquiry } from './contact';
import { email } from './data';

export default function ContactForm() {
  const busy = useRef(false);
  const [state, setState] = useState({ kind: 'idle', message: '' });
  const sending = state.kind === 'sending';

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    busy.current = true;
    setState({ kind: 'sending', message: 'Sending your message…' });
    try {
      await submitInquiry(fields);
      form.reset();
      setState({ kind: 'success', message: 'Thank you! Your inquiry has been submitted. I’ll be in touch soon.' });
    } catch (error) {
      setState({ kind: 'error', message: error.name === 'TimeoutError'
        ? 'The request timed out, so delivery could not be confirmed. Your message is still here. You can try again or email me directly.'
        : 'Your message could not be submitted. Please check your connection and try again, or email me directly.' });
    } finally {
      busy.current = false;
    }
  }

  return <form action={contactAction} method="POST" onSubmit={handleSubmit} aria-busy={sending} className="flex flex-col gap-4">
    <input type="hidden" name="_subject" value="New portfolio inquiry" />
    <input type="hidden" name="_template" value="table" />
    <div className="hidden" aria-hidden="true"><label htmlFor="contact-honey">Leave this field empty</label><input id="contact-honey" name="_honey" type="text" tabIndex={-1} autoComplete="off" /></div>
    <fieldset disabled={sending} className="flex min-w-0 flex-col gap-4 border-0 p-0">
      <label className="sr-only" htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="Your Name" required maxLength={120} />
      <label className="sr-only" htmlFor="email">Your email</label><input id="email" name="email" type="email" autoComplete="email" placeholder="Your Email" required maxLength={254} />
      <label className="sr-only" htmlFor="project">Project type</label><input id="project" name="project" placeholder="Project Type" maxLength={200} />
      <label className="sr-only" htmlFor="message">Tell me about your project</label><textarea id="message" name="message" rows={4} placeholder="Tell me about your project" required maxLength={5000} />
      <p className="text-xs leading-5 text-cream/90">Your details will be sent securely through FormSubmit so I can reply to your inquiry.</p>
      <button type="submit" className="paper-button self-start bg-yellow text-ink disabled:cursor-wait disabled:opacity-70">{sending ? 'Sending…' : 'Send Message'} <span aria-hidden="true">↗</span></button>
    </fieldset>
    <div role="status" aria-live="polite" aria-atomic="true" className="text-sm leading-6">
      {state.message && <p className="rounded-lg border-2 border-cream/40 bg-ink/15 px-4 py-3">{state.message}{state.kind === 'error' && <> <a href={`mailto:${email}`} className="font-semibold underline underline-offset-4">Email {email}</a></>}</p>}
    </div>
  </form>;
}
