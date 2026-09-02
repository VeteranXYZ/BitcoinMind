import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import siteData from './src/data/site.json' with { type: 'json' };

/**
 * Fontsource ships every face as woff2 *and* legacy woff. Vite emits both
 * because both are referenced, so the build carried ~260KB of .woff that no
 * browser capable of running this site would ever request — woff2 has been
 * universal since 2016, and the site already depends on `inert`, `dvh`, and
 * ResizeObserver. Stripping the fallback before Vite reads the CSS means the
 * files are never emitted at all, rather than deleted afterwards.
 */
function woff2Only() {
  return {
    name: 'bitcoinmind:woff2-only',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('@fontsource') || !id.includes('.css')) return null;
      const stripped = code.replace(/,\s*url\([^)]+\.woff\)\s*format\((['"])woff\1\)/g, '');
      return stripped === code ? null : { code: stripped, map: null };
    },
  };
}

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
    plugins: [woff2Only()],
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
