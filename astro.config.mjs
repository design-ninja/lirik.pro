import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: 'https://lirik.pro',
  integrations: [icon(), sitemap(), robots(), partytown()],
  renderers: ['@astrojs/renderer-postcss']
});