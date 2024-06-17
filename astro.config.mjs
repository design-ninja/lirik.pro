import { defineConfig } from 'astro/config';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://lirik.pro',
  renderers: ['@astrojs/renderer-postcss'],
  integrations: [icon()]
});