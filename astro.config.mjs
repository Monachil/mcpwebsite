import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monachill.com',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: true,
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.5,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
