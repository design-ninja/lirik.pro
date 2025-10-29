import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://lirik.pro',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    routing: {
      strategy: 'manual',
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [
    icon(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'https://lirik.pro',
          en: 'https://lirik.pro/en'
        }
      }
    })
  ]
});
