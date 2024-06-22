import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";
import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  site: 'https://lirik.pro',
  integrations: [icon(), sitemap(), robots(), critters()],
  renderers: ['@astrojs/renderer-postcss']
});