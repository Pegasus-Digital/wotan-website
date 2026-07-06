#!/usr/bin/env bash
# Bootstraps Let's Encrypt certs for domains that don't have one yet.
# Solves the chicken-and-egg problem: nginx refuses to start if a referenced
# cert file is missing, but certbot (webroot) needs nginx running to issue it.
#
# Strategy: create a temporary self-signed cert for any missing domain,
# start nginx, issue the real cert via the certbot container, swap, reload.
#
# Run from the repo root on the server:  bash nginx/init-certs.sh
set -euo pipefail

EMAIL="joaobertottoneto@gmail.com"
CONF_DIR="./nginx/certbot/conf"
# domain[:extra domains]
CERTS=(
  "wotanbrindes.com.br:www.wotanbrindes.com.br"
  "testes.wotanbrindes.com.br"
)

mkdir -p "$CONF_DIR/live"
BOOTSTRAPPED=()

for entry in "${CERTS[@]}"; do
  primary="${entry%%:*}"
  live="$CONF_DIR/live/$primary"
  if [ -f "$live/fullchain.pem" ]; then
    echo "==> $primary: cert already present, skipping"
    continue
  fi
  echo "==> $primary: creating temporary self-signed cert"
  mkdir -p "$live"
  docker compose run --rm --entrypoint "" certbot sh -c "
    apk add --no-cache openssl >/dev/null 2>&1 || true
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout '/etc/letsencrypt/live/$primary/privkey.pem' \
      -out '/etc/letsencrypt/live/$primary/fullchain.pem' \
      -subj '/CN=$primary'"
  BOOTSTRAPPED+=("$entry")
done

echo "==> starting nginx"
docker compose up -d nginx
sleep 3

for entry in "${BOOTSTRAPPED[@]:-}"; do
  [ -z "$entry" ] && continue
  primary="${entry%%:*}"
  domains="-d $primary"
  if [ "$entry" != "$primary" ]; then
    for d in ${entry#*:}; do domains="$domains -d $d"; done
  fi
  echo "==> $primary: removing temp cert and requesting real one"
  rm -rf "$CONF_DIR/live/$primary"
  docker compose run --rm --entrypoint "" certbot \
    certbot certonly --webroot -w /var/www/certbot \
    $domains --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
done

echo "==> reloading nginx"
docker compose exec nginx nginx -s reload
echo "==> done"
