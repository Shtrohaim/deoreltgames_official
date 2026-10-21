import type { Lang, Localized } from './i18n';
import studioJson from '../content/studio.json';

export type StoreId = 'rustore' | 'google-play';

export interface Store {
  id: StoreId;
  url: string | null;
  status: 'available' | 'coming-soon';
}

export interface Trailer {
  ru: string | null;
  en: string | null;
}

export interface Dlc {
  title: Localized;
  description: Localized;
  trailer: Trailer;
  features?: Record<Lang, string[]>;
  release?: Localized;
}

export interface Screenshot {
  /** File name without extension in /public/screens/<slug>/<lang>/. */
  file: string;
  caption: Localized;
}

export interface NewsItem {
  slug: string;
  date: string;
  game?: string;
  /** Path in /public; "{lang}" is replaced with the page language. */
  image?: string;
  title: Localized;
  text: Record<Lang, string[]>;
}

export interface Game {
  slug: string;
  title: string;
  order: number;
  genre: Localized;
  tagline: Localized;
  description: Localized;
  trailer: Trailer;
  screenshots?: Screenshot[];
  stores: Store[];
  dlc: Dlc[];
}

export const studio = studioJson;

const modules = import.meta.glob<Game>('/content/games/*.json', { eager: true, import: 'default' });
export const games: Game[] = Object.values(modules).sort((a, b) => a.order - b.order);

const newsModules = import.meta.glob<NewsItem>('/content/news/*.json', { eager: true, import: 'default' });
/** Newest first. */
export const news: NewsItem[] = Object.values(newsModules).sort((a, b) => b.date.localeCompare(a.date));

/** Trailer in the page language, falling back to Russian. */
export function pickTrailer(trailer: Trailer, lang: Lang): { id: string; native: boolean } | null {
  if (trailer[lang]) return { id: trailer[lang]!, native: true };
  if (trailer.ru) return { id: trailer.ru, native: false };
  return null;
}
