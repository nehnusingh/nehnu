import { useEffect, useState } from 'react';
import { email, reviews, services } from './data';
import ProjectVideos from './ProjectVideos';
import ContactForm from './ContactForm';
import AboutVideo from './AboutVideo';

function Star({ className = '' }) {
  return <span aria-hidden="true" className={`paper-star pointer-events-none absolute ${className}`} />;
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = event => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  return <header className="fixed inset-x-0 top-0 z-50 border-b-[3px] border-ink bg-cream">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
      <a href="#top" aria-label="Yash home" onClick={() => setOpen(false)} className="font-display -rotate-2 text-3xl tracking-wider">YASH<span className="text-teal">.</span></a>
      <button type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)} className="rounded-lg border-2 border-ink bg-yellow px-4 py-2 font-semibold md:hidden">{open ? 'Close ×' : 'Menu ☰'}</button>
      <nav id="site-nav" aria-label="Main navigation" className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col gap-1 border-b-[3px] border-ink bg-cream p-5 md:static md:flex md:flex-row md:gap-2 md:border-0 md:p-0`}>
        {['Work', 'About', 'Services', 'Reviews', 'Contact'].map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-colors hover:bg-yellow">{item}</a>)}
      </nav>
    </div>
  </header>;
}

function SectionHeading({ eyebrow, children, teal = false }) {
  return <div className="relative z-10 mb-10 md:mb-12"><span className={`font-hand mb-1 block text-2xl font-bold ${teal ? 'text-yellow' : 'text-teal'}`}>{eyebrow}</span><h2 className={`font-display text-4xl leading-tight tracking-wide sm:text-5xl lg:text-6xl ${teal ? 'text-yellow' : 'text-ink'}`}>{children}</h2></div>;
}

function Hero() {
  return <section id="top" className="relative flex min-h-svh items-center overflow-hidden px-6 pt-36 pb-24 md:px-12">
    <Star className="top-[18%] right-[8%] h-24 w-24 rotate-12 bg-teal lg:h-36 lg:w-36" /><Star className="bottom-[9%] left-[4%] h-14 w-14 -rotate-12 bg-yellow" />
    <div className="relative z-10 mx-auto w-full max-w-6xl"><span className="paper-badge">YASH SINGH</span><h1 className="hero-title font-display mt-7 text-[clamp(3rem,8.5vw,7rem)] leading-[.98] tracking-wide">CREATIVE<br /><span className="text-teal">VIDEO EDITOR</span></h1><p className="font-hand mt-7 max-w-xl text-2xl font-semibold text-teal-dark sm:text-3xl">“Crafting cinematic stories, frame by frame!”</p><div className="mt-9 flex flex-wrap gap-5"><a href="#work" className="paper-button bg-yellow">View Portfolio <span aria-hidden="true">↗</span></a><a href="#contact" className="paper-button bg-white">Hire Me</a></div></div>
  </section>;
}

function Work() {
  return <section id="work" className="section-shell bg-teal text-cream"><Star className="top-10 left-[3%] h-24 w-24 -rotate-12 bg-yellow/40" /><div className="content-shell"><SectionHeading eyebrow="selected work" teal>Featured Projects</SectionHeading><ProjectVideos /></div></section>;
}

function About() {
  return <section id="about" className="section-shell"><Star className="top-12 right-[5%] h-20 w-20 rotate-12 bg-teal/25" /><div className="content-shell grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
    <AboutVideo />
    <div><SectionHeading eyebrow="hello, i'm yash">The Story Behind the Cut</SectionHeading><p className="mb-5 leading-8">I'm a video editor and motion designer with a background in narrative filmmaking. Over the past several years I've cut everything from brand anthems to festival documentaries — always chasing the same thing: a rhythm that makes the viewer feel the story instead of just watching it.</p><p className="leading-8">My process blends disciplined structure with instinct — every sequence is storyboarded, timed, and graded with intent, but the final cut always leaves room for the moment that surprises even me.</p><div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">{[['30+', 'Projects'], ['1', 'Years'], ['4.7', 'Rating']].map(([value, label]) => <div key={label} className="paper-card bg-white px-2 py-4 text-center"><b className="font-display block text-3xl text-teal sm:text-4xl">{value}</b><span className="text-[11px] font-semibold tracking-wide uppercase">{label}</span></div>)}</div></div>
  </div></section>;
}

function Services() {
  return <section id="services" className="section-shell bg-teal"><div className="content-shell"><SectionHeading eyebrow="what i offer" teal>Services</SectionHeading><div className="relative z-10 space-y-5">{services.map(([title, description], index) => <article key={title} className="service-card paper-card flex flex-col gap-3 bg-white px-6 py-6 md:flex-row md:items-center md:justify-between md:gap-8"><div className="flex items-center gap-5"><span className="font-display text-2xl text-teal">0{index + 1}</span><h3 className="text-xl font-semibold">{title}</h3></div><p className="max-w-sm text-sm leading-6 text-ink/75 md:text-right">{description}</p></article>)}</div></div><Star className="right-[2%] bottom-8 h-24 w-24 rotate-12 bg-yellow" /></section>;
}

function Reviews() {
  return <section id="reviews" className="section-shell"><div className="content-shell"><SectionHeading eyebrow="testimonials">Client Reviews</SectionHeading><div className="grid gap-7 lg:grid-cols-3">{reviews.map(review => <figure key={review.name} className="paper-card flex flex-col bg-cream-dark p-7"><div aria-label="5 out of 5 stars" className="mb-4 tracking-[.2em] text-teal">★★★★★</div><blockquote className="mb-6 grow text-base leading-8">{review.quote}</blockquote><figcaption className="flex items-center gap-3"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-yellow text-sm font-semibold">{review.initials}</span><div><b className="block text-sm">{review.name}</b><span className="text-xs text-ink/75">{review.role}</span></div></figcaption></figure>)}</div></div></section>;
}

function Contact() {
  return <section id="contact" className="section-shell bg-teal text-cream"><div className="content-shell"><SectionHeading eyebrow="get in touch" teal>Let's Cut Something Great</SectionHeading><div className="grid gap-12 md:grid-cols-2"><div><p className="mb-7 max-w-lg leading-8">Have a project in mind? Send over the brief, footage details, and timeline — I typically respond within 24 hours.</p><dl className="space-y-5 text-sm"><div className="contact-detail"><dt>EMAIL</dt><dd><a className="break-all underline-offset-4 hover:underline" href={`mailto:${email}`}>{email}</a></dd></div><div className="contact-detail"><dt>PHONE</dt><dd><a href="tel:+917088851417">+91 7088851417</a></dd></div><div className="contact-detail"><dt>BASED IN</dt><dd>Mumbai, India — Remote Worldwide</dd></div></dl></div>
    <ContactForm />
  </div></div></section>;
}

export default function App() {
  return <><a href="#main" className="skip-link">Skip to content</a><Header /><main id="main"><Hero /><Work /><About /><Services /><Reviews /><Contact /></main><footer className="border-t-[3px] border-ink px-6 py-8 md:px-12"><div className="content-shell flex flex-wrap items-center justify-between gap-5 text-sm"><p>© {new Date().getFullYear()} Yash. All rights reserved.</p><a href="#top" className="font-semibold underline-offset-4 hover:underline">Back to top ↑</a></div></footer></>;
}
