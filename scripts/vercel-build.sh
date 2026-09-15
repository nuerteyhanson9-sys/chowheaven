#!/usr/bin/env bash
set -e

if [ "$VERCEL_ENV" = "production" ]; then
  MIGRATE_URL="${POSTGRES_PRISMA_URL:-$DATABASE_URL_UNPOOLED:-$DATABASE_URL}"
  echo "Applying Prisma migrations on production database…"
  DATABASE_URL="$MIGRATE_URL" npx prisma migrate deploy

  echo "Applying local images to production database…"
  DATABASE_URL="$MIGRATE_URL" npx tsx scripts/apply-images.ts

  if [ "$RUN_SEED" = "true" ]; then
    echo "Seeding production database…"
    DATABASE_URL="$MIGRATE_URL" npm run db:seed
    echo "Re-applying local images after seed…"
    DATABASE_URL="$MIGRATE_URL" npx tsx scripts/apply-images.ts
  fi
fi

next build