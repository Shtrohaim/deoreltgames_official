import type { Lang } from './i18n';

export type DocId = 'privacy' | 'consent' | 'delete-data';
export const docIds: DocId[] = ['privacy', 'consent', 'delete-data'];

// content/legal/<game-slug>/<doc>.<lang>.html — current text of the document, without the title.
// content/legal/<game-slug>/<doc>.v<N>.<lang>.html — an earlier version, kept for people who agreed to it.
// content/legal/<game-slug>/versions.json — when each earlier version stopped being in effect.
const files = import.meta.glob<string>('/content/legal/*/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const manifests = import.meta.glob<Record<string, { version: number; until: string }[]>>(
  '/content/legal/*/versions.json',
  { import: 'default', eager: true },
);

export interface LegalDoc {
  slug: string;
  doc: DocId;
  html: string;
  /** False when the page language has no version and Russian is shown instead. */
  native: boolean;
}

export interface ArchivedVersion {
  version: number;
  /** ISO date until which this version was in effect. */
  until: string;
}

function file(slug: string, name: string, lang: Lang): string | undefined {
  return files[`/content/legal/${slug}/${name}.${lang}.html`];
}

function load(slug: string, doc: DocId, name: string, lang: Lang): LegalDoc | null {
  const own = file(slug, name, lang);
  if (own) return { slug, doc, html: own, native: true };
  const ru = file(slug, name, 'ru');
  return ru ? { slug, doc, html: ru, native: false } : null;
}

export function getDoc(slug: string, doc: DocId, lang: Lang): LegalDoc | null {
  return load(slug, doc, doc, lang);
}

export function getArchivedDoc(slug: string, doc: DocId, version: number, lang: Lang): LegalDoc | null {
  return load(slug, doc, `${doc}.v${version}`, lang);
}

/** Documents that exist for a game, in display order. */
export function docsFor(slug: string): DocId[] {
  return docIds.filter((d) => file(slug, d, 'ru') || file(slug, d, 'en'));
}

/** Earlier versions of a document, newest first. */
export function archivedVersions(slug: string, doc: DocId): ArchivedVersion[] {
  const manifest = manifests[`/content/legal/${slug}/versions.json`] ?? {};
  return [...(manifest[doc] ?? [])].sort((a, b) => b.version - a.version);
}
