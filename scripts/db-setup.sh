#!/usr/bin/env bash
set -e
export PGPASSWORD=postgres
if psql -U postgres -h 127.0.0.1 -tAc "SELECT 1 FROM pg_database WHERE datname='chowheaven'" | grep -q 1; then
  echo "db exists"
else
  psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE chowheaven"
  echo "db created"
fi
psql -U postgres -h 127.0.0.1 -d chowheaven -tAc "SELECT current_database(), version();" | head -1