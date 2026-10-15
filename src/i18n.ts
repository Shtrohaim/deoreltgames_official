export const langs = ['ru', 'en'] as const;
export type Lang = (typeof langs)[number];
export type Localized = Record<Lang, string>;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Page link with base path and language prefix. `path` starts and ends with "/". */
export function href(lang: Lang, path = '/'): string {
  return `${base}${lang === 'en' ? '/en' : ''}${path}`;
}

/** Link to a file in /public (not language-specific). */
export function asset(path: string): string {
  return `${base}${path}`;
}

export const t = {
  ru: {
    meta: {
      description: 'DeorelTGames — инди-студия мобильных игр. Hard Cooking Simulator и другие проекты.',
    },
    nav: { games: 'Игры', about: 'О студии', contacts: 'Контакты' },
    langSwitch: 'EN',
    langSwitchLabel: 'English version',
    hero: {
      lead: 'Делаем яркие мобильные игры, в которые хочется вернуться.',
      ctaGames: 'Наши игры',
    },
    games: {
      title: 'Игры',
      more: 'Подробнее',
      dlcBadge: 'Дополнение',
    },
    about: {
      title: 'О студии',
      text: 'DeorelTGames — независимая студия, которая делает мобильные игры для Android. Мы сами придумываем, программируем и выпускаем свои проекты, а новости, трейлеры и закулисье публикуем на YouTube и в TikTok.',
      points: [
        { title: 'Мобильные игры', text: 'Проекты для Android — короткие сессии, яркий стиль, честная сложность.' },
        { title: 'RuStore и Google Play', text: 'Выпускаем игры в официальных магазинах приложений.' },
        { title: 'Открыто о разработке', text: 'Трейлеры и ролики о разработке — на наших каналах.' },
      ],
    },
    contacts: {
      title: 'Контакты',
      lead: 'Вопросы, предложения о сотрудничестве или отзыв об игре — пишите.',
      email: 'Почта',
    },
    stores: {
      rustore: 'Скачать в RuStore',
      'google-play': 'Google Play',
      soon: 'скоро',
    },
    game: {
      back: 'Все игры',
      trailer: 'Трейлер',
      screenshots: 'Скриншоты',
      screenshotsSoon: 'Скриншоты скоро появятся',
      dlcTitle: 'Дополнение',
      dlcTrailerAbove: 'Трейлер дополнения — выше.',
      otherVideos: 'Ещё видео',
      inRussian: 'На русском',
      privacy: 'Политика конфиденциальности',
      play: 'Смотреть видео',
    },
    footer: { rights: 'Все права защищены.', privacy: 'Политика конфиденциальности' },
  },
  en: {
    meta: {
      description: 'DeorelTGames is an indie mobile games studio. Hard Cooking Simulator and more.',
    },
    nav: { games: 'Games', about: 'About', contacts: 'Contact' },
    langSwitch: 'RU',
    langSwitchLabel: 'Русская версия',
    hero: {
      lead: 'We make bold mobile games you want to come back to.',
      ctaGames: 'Our games',
    },
    games: {
      title: 'Games',
      more: 'Learn more',
      dlcBadge: 'Expansion',
    },
    about: {
      title: 'About the studio',
      text: 'DeorelTGames is an independent studio making mobile games for Android. We design, code and ship our own projects, and share news, trailers and behind-the-scenes on YouTube and TikTok.',
      points: [
        { title: 'Mobile games', text: 'Android games with short sessions, bold style and fair challenge.' },
        { title: 'RuStore & Google Play', text: 'Our games are released in official app stores.' },
        { title: 'Open development', text: 'Trailers and dev videos on our channels.' },
      ],
    },
    contacts: {
      title: 'Contact',
      lead: 'Questions, partnership offers or feedback about our games — drop us a line.',
      email: 'Email',
    },
    stores: {
      rustore: 'Get it on RuStore',
      'google-play': 'Google Play',
      soon: 'coming soon',
    },
    game: {
      back: 'All games',
      trailer: 'Trailer',
      screenshots: 'Screenshots',
      screenshotsSoon: 'Screenshots coming soon',
      dlcTitle: 'Expansion',
      dlcTrailerAbove: 'The expansion trailer is above.',
      otherVideos: 'More videos',
      inRussian: 'In Russian',
      privacy: 'Privacy Policy',
      play: 'Play video',
    },
    footer: { rights: 'All rights reserved.', privacy: 'Privacy Policy' },
  },
} as const;
