#!/usr/bin/env bash
set -e

if [ "$VERCEL_ENV" = "production" ]; then
  MIGRATE_URL="${POSTGRES_PRISMA_URL:-$DATABASE_URL_UNPOOLED:-$DATABASE_URL}"
  echo "Applying Prisma migrations on production database…"
  attempt=1
  until DATABASE_URL="$MIGRATE_URL" npx prisma migrate deploy; do
    if [ "$attempt" -ge 5 ]; then
      echo "prisma migrate deploy failed after $attempt attempts (P1002 lock/timeout)." >&2
      exit 1
    fi
    echo "Migration attempt $attempt failed (advisory lock/timeout). Retrying in $((attempt * 5))s…"
    sleep "$((attempt * 5))"
    attempt=$((attempt + 1))
  done

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