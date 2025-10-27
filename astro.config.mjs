import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://lirik.pro',
  output: 'server',
  adapter: netlify(),
  integrations: [icon(), mdx(), sitemap()]
});
