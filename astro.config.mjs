import { defineConfig } from 'astro/config';

// GitHub Pages with the custom domain https://deoreltgames.ru/
// SITE_URL / BASE_PATH override this, e.g. for a preview under a sub-path.
const site = process.env.SITE_URL ?? 'https://deoreltgames.ru';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
});
