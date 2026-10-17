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
      description: 'DeorelTGames — инди-разработчик мобильных игр. Hard Cooking Simulator и другие проекты.',
    },
    nav: { games: 'Игры', about: 'Обо мне', contacts: 'Контакты' },
    langSwitch: 'EN',
    langSwitchLabel: 'English version',
    hero: {
      lead: 'Делаю яркие мобильные игры, в которые хочется вернуться.',
      ctaGames: 'Мои игры',
    },
    games: {
      title: 'Игры',
      more: 'Подробнее',
      dlcBadge: 'Дополнение',
    },
    about: {
      title: 'Обо мне',
      text: 'DeorelTGames — независимый разработчик мобильных игр для Android. Всё делаю сам: придумываю, программирую и выпускаю свои проекты, а новости, трейлеры и закулисье публикую на YouTube и в TikTok.',
      points: [
        { title: 'Один разработчик', text: 'Каждую игру от идеи до релиза делаю сам.' },
        { title: 'RuStore и Google Play', text: 'Выпускаю игры в официальных магазинах приложений.' },
        { title: 'Открыто о разработке', text: 'Трейлеры и ролики о разработке — на моих каналах.' },
      ],
    },
    contacts: {
      title: 'Контакты',
      lead: 'Вопросы, предложения о сотрудничестве или отзыв об игре — пишите мне.',
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
      play: 'Смотреть видео',
    },
    legal: {
      title: 'Документы',
      lead: 'Политики конфиденциальности и другие документы по играм.',
      privacy: 'Политика конфиденциальности',
      consent: 'Согласие на обработку персональных данных',
      ruOnly: 'Документ доступен только на русском языке.',
      backToGame: 'К странице игры',
    },
    footer: { rights: 'Все права защищены.', docs: 'Документы' },
  },
  en: {
    meta: {
      description: 'DeorelTGames is a solo indie mobile game developer. Hard Cooking Simulator and more.',
    },
    nav: { games: 'Games', about: 'About', contacts: 'Contact' },
    langSwitch: 'RU',
    langSwitchLabel: 'Русская версия',
    hero: {
      lead: 'I make bold mobile games you want to come back to.',
      ctaGames: 'My games',
    },
    games: {
      title: 'Games',
      more: 'Learn more',
      dlcBadge: 'Expansion',
    },
    about: {
      title: 'About me',
      text: 'DeorelTGames is an independent solo developer making mobile games for Android. I design, code and ship every project myself, and share news, trailers and behind-the-scenes on YouTube and TikTok.',
      points: [
        { title: 'One developer', text: 'Every game, from idea to release, made by one person.' },
        { title: 'RuStore & Google Play', text: 'My games are released in official app stores.' },
        { title: 'Open development', text: 'Trailers and dev videos on my channels.' },
      ],
    },
    contacts: {
      title: 'Contact',
      lead: 'Questions, partnership offers or feedback about my games — drop me a line.',
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
      play: 'Play video',
    },
    legal: {
      title: 'Legal',
      lead: 'Privacy policies and other documents for each game.',
      privacy: 'Privacy Policy',
      consent: 'Consent to Personal Data Processing',
      ruOnly: 'This document is available in Russian only.',
      backToGame: 'Back to the game',
    },
    footer: { rights: 'All rights reserved.', docs: 'Legal' },
  },
} as const;
