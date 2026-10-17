import type { Lang } from './i18n';

export type DocId = 'privacy' | 'consent';
export const docIds: DocId[] = ['privacy', 'consent'];

// content/legal/<game-slug>/<doc>.<lang>.html — body of the document without the title.
const files = import.meta.glob<string>('/content/legal/*/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export interface LegalDoc {
  slug: string;
  doc: DocId;
  html: string;
  /** False when the page language has no version and Russian is shown instead. */
  native: boolean;
}

function file(slug: string, doc: DocId, lang: Lang): string | undefined {
  return files[`/content/legal/${slug}/${doc}.${lang}.html`];
}

export function getDoc(slug: string, doc: DocId, lang: Lang): LegalDoc | null {
  const own = file(slug, doc, lang);
  if (own) return { slug, doc, html: own, native: true };
  const ru = file(slug, doc, 'ru');
  return ru ? { slug, doc, html: ru, native: false } : null;
}

/** Documents that exist for a game, in display order. */
export function docsFor(slug: string): DocId[] {
  return docIds.filter((d) => file(slug, d, 'ru') || file(slug, d, 'en'));
}
