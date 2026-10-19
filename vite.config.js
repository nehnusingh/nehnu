import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { normalizeSiteUrl, robotsTxt, seo, seoTags, sitemapXml } from './src/seo.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL || env.SITE_URL || '');
  return {
    base: './',
    plugins: [react(), tailwindcss(), {
      name: 'portfolio-seo',
      transformIndexHtml(html) {
        return { html: html.replace(/<title>.*?<\/title>/, `<title>${seo.title.replace(/&/g, '&amp;')}</title>`), tags: seoTags(siteUrl).map(tag => ({ ...tag, injectTo: 'head' })) };
      },
      generateBundle(options) {
        if (options.format !== 'es') return;
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(siteUrl) });
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(siteUrl) });
      },
    }],
  };
});
