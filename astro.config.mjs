import { defineConfig } from 'astro/config';

// Defaults: GitHub Pages at https://shtrohaim.github.io/deoreltgames_official/
// For the VPS build set SITE_URL=https://<domain> and BASE_PATH=/
const site = process.env.SITE_URL ?? 'https://shtrohaim.github.io';
const base = process.env.BASE_PATH ?? '/deoreltgames_official';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
});
