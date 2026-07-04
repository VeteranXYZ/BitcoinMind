import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://bitcoinmind.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    preact({ compat: true }),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
