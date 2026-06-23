#!/bin/sh
set -e
cd /app
# Migrations körs vid deploy/setup; full prisma CLI kräver fler node_modules än vi kopierar.
if [ "${RUN_MIGRATIONS:-0}" = "1" ] && [ -n "$DATABASE_URL" ]; then
  ./node_modules/.bin/prisma migrate deploy || echo "warn: prisma migrate failed, continuing"
fi
exec node server.js