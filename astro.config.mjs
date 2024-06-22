import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import robots from "astro-robots";
import sitemap from "@astrojs/sitemap";
import critters from "astro-critters";
import serviceWorker from "astrojs-service-worker";

// https://astro.build/config
export default defineConfig({
  site: 'https://lirik.pro',
  integrations: [icon(), sitemap(), robots(), critters(), serviceWorker()],
  renderers: ['@astrojs/renderer-postcss']
});