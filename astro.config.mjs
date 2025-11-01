import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import inline from '@playform/inline';

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
  integrations: [mdx(), sitemap(), inline()]
});
