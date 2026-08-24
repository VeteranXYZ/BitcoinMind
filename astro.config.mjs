import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import siteData from './src/data/site.json' with { type: 'json' };

export default defineConfig({
  site: siteData.url,
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    preact({ compat: true }),
  ],
  vite: {
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        drafts: { customMedia: true },
      },
    },
    build: {
      cssCodeSplit: true,
    },
  },
});
