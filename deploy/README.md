# Переезд сайта на свой VPS (Debian 12)

Сайт продолжает публиковаться на GitHub Pages, пока не выполнены все шаги ниже.
Публикация на VPS (`.github/workflows/deploy-vps.yml`) включится сама, когда в репозитории
появится переменная `VPS_DOMAIN`.

## 1. Домен

Купите домен (например, `deoreltgames.ru`) и в DNS у регистратора добавьте две записи типа **A**:

| Имя | Значение |
|---|---|
| `@` | IP-адрес VPS |
| `www` | IP-адрес VPS |

Подождите, пока записи заработают (обычно от нескольких минут до пары часов).
Проверка: `ping deoreltgames.ru` должен показывать IP вашего сервера.

## 2. Настройка сервера

Зайдите на VPS по SSH и выполните:

```bash
curl -fsSLO https://raw.githubusercontent.com/Shtrohaim/deoreltgames_official/main/deploy/setup-server.sh
sudo bash setup-server.sh deoreltgames.ru
```

Скрипт поставит nginx, создаст пользователя `deploy` и папку `/var/www/deoreltgames`,
выключит запись IP-адресов посетителей и получит HTTPS-сертификат Let's Encrypt
(запуская скрипт, вы принимаете условия Let's Encrypt). Другие сайты и firewall он не трогает.

## 3. Ключ для автопубликации

На своём компьютере создайте отдельный ключ (без пароля — его будет использовать GitHub):

```bash
ssh-keygen -t ed25519 -f deoreltgames_deploy -N "" -C "github-actions-deploy"
```

Появятся два файла: `deoreltgames_deploy` (секретный) и `deoreltgames_deploy.pub` (публичный).

Содержимое **публичного** `.pub` добавьте на сервер:

```bash
sudo nano /home/deploy/.ssh/authorized_keys
```

## 4. Настройки репозитория на GitHub

Settings → Secrets and variables → Actions:

- вкладка **Secrets** → New repository secret:
  - `VPS_HOST` — IP-адрес сервера;
  - `VPS_SSH_KEY` — всё содержимое **секретного** файла `deoreltgames_deploy`;
- вкладка **Variables** → New repository variable:
  - `VPS_DOMAIN` — домен, например `deoreltgames.ru`.

После этого удалите файл `deoreltgames_deploy` с компьютера — он хранится только в GitHub.

## 5. Первая публикация

Actions → **Deploy to VPS** → Run workflow. Через минуту сайт откроется на `https://<домен>/`.

Дальше каждый push в `main` публикует сайт автоматически.
