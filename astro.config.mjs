import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import criticalCSS from 'astro-critical-css';

export default defineConfig({
  site: 'https://lirik.pro',
  output: 'static',
  build: {
    compressHTML: true
  },
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [mdx(), sitemap(), criticalCSS()]
});
