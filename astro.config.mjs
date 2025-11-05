import { defineConfig, fontProviders } from 'astro/config';
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
  integrations: [mdx(), sitemap(), inline()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'Onest',
        cssVariable: '--font-onest',
        weights: ['100 900'],
        styles: ['normal'],
        subsets: ['latin', 'cyrillic'],
        display: 'swap'
      }
    ]
  }
});
