import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bitcoinmind.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    preact({ compat: true }),
    sitemap(),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
