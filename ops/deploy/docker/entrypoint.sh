#!/bin/sh
set -e

echo "⏳ Waiting for database to be ready..."
until nc -z db 5432; do
  echo "Waiting for database..."
  sleep 1
done

echo "🚀 Running migrations..."
npx prisma migrate deploy

echo "🌱 Generating Prisma client..."
npx prisma generate

if [ ! -f .seed_done ]; then
  echo "🌱 Running seed script..."
  npx prisma db seed
  touch .seed_done
else
  echo "✅ Seed already applied, skipping."
fi

echo "▶️ Starting application..."
exec node api
