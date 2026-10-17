# DeorelTGames — официальный сайт

Сайт DeorelTGames — инди-разработчика мобильных игр (Mobile Games Development): https://shtrohaim.github.io/deoreltgames_official/

Сделан на [Astro](https://astro.build), публикуется на GitHub Pages автоматически при каждом push в `main`.

## Запуск локально

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:4321/deoreltgames_official/

## Где что лежит

- `content/studio.json` — почта и соцсети (по языкам).
- `content/games/*.json` — игры: описание, трейлеры (ID видео YouTube), магазины, дополнения. Новая игра = новый JSON-файл.
- `src/i18n.ts` — тексты интерфейса на русском и английском.
- `src/styles/global.css` — цвета и общий стиль.
- `public/games/<игра>/privacy/` — политики конфиденциальности.
