# Yash — React portfolio

A responsive static portfolio converted from the supplied scrapbook template using React, Vite, and Tailwind CSS v4. No backend or environment variables required.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the GitHub Pages publishing steps. The included workflow builds, checks, and deploys the site on pushes to `main` once Pages is enabled.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Upload `dist/` to any static host. Relative asset paths support hosting in a subdirectory. Serve the build over HTTP rather than opening `dist/index.html` directly.

## Customize

- Projects, video links, services, reviews, and email: `src/data.js`.
- The About section's Raw Footage video: the `rawFootage` entry in `src/data.js`. Its frame shows a thumbnail, plays a muted preview on mouse hover, and opens the shared video modal on click or tap.
- Biography, statistics, location, phone, and headings: `src/App.jsx`.
- Colors, fonts, and scrapbook effects: `src/index.css`.
- Page title and description: `src/seo.js`.

Biography, statistics, reviews, phone number, and project descriptions are retained template content; review before publishing. Project covers are CSS artwork. The first two projects retain the supplied YouTube links; add URLs for the remaining projects to replace their “Video coming soon” labels.

The contact form uses FormSubmit's free hosted service to send inquiries to `nehnusingh81@gmail.com`. No custom server, API key, or email password is needed. Google Fonts requires internet access, with system-font fallbacks available.

## Contact form activation

1. Serve the site over HTTP(S) and submit an inquiry through the form.
2. Check `nehnusingh81@gmail.com` (including Spam) for FormSubmit's activation email and click its confirmation link. This one-time inbox confirmation is required before inquiries are delivered normally.
3. Submit a fresh test inquiry after activation and confirm it arrives. FormSubmit uses the visitor's email as Reply-To, so you can reply directly.

The JavaScript form uses FormSubmit's AJAX endpoint and shows sending, accepted, and failure feedback. An accepted response means the service accepted the request; it does not independently verify inbox delivery or activation. Form fields stay filled on errors; duplicate submissions are blocked while sending. Requests time out after 20 seconds, in which case delivery is unconfirmed. A hidden honeypot helps filter automated submissions. Without JavaScript, the form posts directly to FormSubmit and uses its hosted confirmation flow.

Visitors are informed that FormSubmit processes their submitted details. This is an external service, so delivery depends on its availability and spam filtering. See [FormSubmit documentation](https://formsubmit.co/documentation) and [activation help](https://formsubmit.co/help). Change the `email` export in `src/data.js` to change both the recipient endpoint and displayed contact address; a new recipient must confirm activation too.

YouTube projects play muted previews while a mouse hovers over the card. Leaving the card removes the preview player. Click anywhere on a playable card (or use Enter/Space on its button) to open a modal with YouTube controls and audio. Close with Escape, the Close button, or a backdrop click; closing removes the player and stops playback. Touch devices open the modal on tap. The modal includes a YouTube fallback link for videos with embedding restrictions. Playback requires internet access and depends on browser autoplay permissions and the video's embedding settings.

The original `style.css` and `script.js` remain as reference files and are not loaded by the React app.

## SEO setup

The production build prerenders all portfolio sections into the HTML, then React hydrates the page for video previews, the modal, navigation, and the form. It includes title and description tags, crawler directives, a favicon, Open Graph and Twitter cards, and ProfilePage/Person JSON-LD based on the visible portfolio content. The PNG sharing image is `public/social-preview.png` (1200 × 630).

The tracked `.env` is configured for GitHub Pages and contains only public configuration:

```dotenv
SITE_URL=https://nehnusingh.github.io/nehnu/
```

Then run `npm run build`. The build reads `.env` automatically; `.env.production` and the shell environment can override it. It generates the canonical URL, absolute social URLs, `dist/sitemap.xml`, and the sitemap reference in `dist/robots.txt` from this one value. Include any hosting subfolder in `SITE_URL`.

While `SITE_URL` is blank, the build warns, omits domain-dependent tags, and creates an empty sitemap with an explanatory comment. It never publishes an invented domain. Set the URL and rebuild before publishing or submitting the sitemap. The sitemap lists only the homepage because section anchors are not separate pages. For subfolder hosting, the domain-root `robots.txt` must reference the subfolder sitemap.

After deployment, check the public homepage, robots.txt, sitemap.xml, and social image URLs; then submit the sitemap in Google Search Console. No Search Console verification tag is included until you supply your actual token.
