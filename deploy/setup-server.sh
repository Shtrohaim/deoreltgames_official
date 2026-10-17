#!/usr/bin/env bash
# One-time setup of the DeorelTGames site on a Debian 12 VPS.
#
#   sudo bash setup-server.sh example.ru
#
# Before running: the domain's A record (and www) must point to this server,
# otherwise the HTTPS certificate cannot be issued.
#
# What it does:
#   - installs nginx, certbot and rsync
#   - creates user "deploy" that GitHub Actions uses to upload the site
#   - serves /var/www/deoreltgames with visitor IP logging switched off
#   - gets a Let's Encrypt certificate and redirects HTTP to HTTPS
# It does not touch other nginx sites or the firewall.
set -euo pipefail

DOMAIN="${1:?Usage: sudo bash setup-server.sh <domain>}"
WEB_ROOT=/var/www/deoreltgames
DEPLOY_USER=deploy
SITE_CONF=/etc/nginx/sites-available/deoreltgames.conf

if [[ $EUID -ne 0 ]]; then
  echo "Run as root: sudo bash $0 $DOMAIN" >&2
  exit 1
fi

echo "==> Installing packages"
apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx rsync

echo "==> Creating user '$DEPLOY_USER'"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --system --group --shell /bin/bash --home "/home/$DEPLOY_USER" "$DEPLOY_USER"
fi
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"

echo "==> Preparing $WEB_ROOT"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$WEB_ROOT"
if [[ ! -f "$WEB_ROOT/index.html" ]]; then
  echo '<!doctype html><meta charset="utf-8"><title>DeorelTGames</title><p>Скоро здесь будет сайт.</p>' > "$WEB_ROOT/index.html"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$WEB_ROOT/index.html"
fi

echo "==> Writing nginx config"
cat > "$SITE_CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    root $WEB_ROOT;
    index index.html;

    # The site keeps no visitor IP addresses: no access log at all.
    access_log off;
    error_log /var/log/nginx/deoreltgames.error.log crit;

    server_tokens off;
    charset utf-8;

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header X-Frame-Options SAMEORIGIN always;

    # Hashed build assets never change.
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files \$uri \$uri/ =404;
    }

    error_page 404 /404.html;
}
NGINX
ln -sf "$SITE_CONF" /etc/nginx/sites-enabled/deoreltgames.conf
nginx -t
systemctl reload nginx

echo "==> Requesting HTTPS certificate"
certbot --nginx --non-interactive --agree-tos --register-unsafely-without-email \
  --redirect -d "$DOMAIN" -d "www.$DOMAIN"

echo
echo "Done. Next: add the GitHub Actions public key to /home/$DEPLOY_USER/.ssh/authorized_keys"
echo "Site: https://$DOMAIN/"
