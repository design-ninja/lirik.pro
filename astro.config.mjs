import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://lirik.pro',
  integrations: [icon(), sitemap(), robots()],
  renderers: ['@astrojs/renderer-postcss']
});