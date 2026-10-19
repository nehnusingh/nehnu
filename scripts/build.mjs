import { readFile, writeFile } from 'node:fs/promises';
import { build, loadEnv } from 'vite';
import { normalizeSiteUrl } from '../src/seo.js';

await build();
await build({ build: { ssr: 'src/entry-server.jsx', outDir: '.prerender' } });
const { render } = await import('../.prerender/entry-server.js');
const html = await readFile('dist/index.html', 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('Prerender failed: root element not found.');
await writeFile('dist/index.html', html.replace(marker, () => `<div id="root">${render()}</div>`));
const env = loadEnv('production', process.cwd(), '');
if (!normalizeSiteUrl(process.env.SITE_URL || env.SITE_URL || '')) {
  console.warn('SEO setup needs SITE_URL in .env: canonical/social URLs are omitted and sitemap.xml has no URLs until you set the public URL and rebuild.');
}
console.log('Static portfolio HTML rendered successfully.');
