#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*://[^@]*@([^:/]+):([0-9]+).*|\1|')
  DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*://[^@]*@([^:/]+):([0-9]+).*|\2|')
else
  DB_HOST="${DB_HOST:-db}"
  DB_PORT="${DB_PORT:-5432}"
fi

echo "⏳ Waiting for database at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "⏳ Waiting for database at $DB_HOST:$DB_PORT..."
  sleep 1
done

echo "🚀 Running migrations..."
npx prisma migrate deploy

echo "🌱 Generating Prisma client..."
npx prisma generate

echo "▶️ Starting application..."
exec node api