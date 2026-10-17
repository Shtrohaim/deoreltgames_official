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
}

export interface Game {
  slug: string;
  title: string;
  order: number;
  genre: Localized;
  tagline: Localized;
  description: Localized;
  trailer: Trailer;
  stores: Store[];
  dlc: Dlc[];
}

export const studio = studioJson;

const modules = import.meta.glob<Game>('/content/games/*.json', { eager: true, import: 'default' });
export const games: Game[] = Object.values(modules).sort((a, b) => a.order - b.order);

/** Trailer in the page language, falling back to Russian. */
export function pickTrailer(trailer: Trailer, lang: Lang): { id: string; native: boolean } | null {
  if (trailer[lang]) return { id: trailer[lang]!, native: true };
  if (trailer.ru) return { id: trailer.ru, native: false };
  return null;
}
