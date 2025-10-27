import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lirik.pro',
  output: 'static',
  integrations: [icon(), mdx(), sitemap()]
});
