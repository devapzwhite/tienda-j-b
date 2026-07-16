#!/bin/sh
set -e

echo "Waiting for database and running migrations..."

RETRIES=10
COUNT=0

until npx prisma@6.19.3 migrate deploy \
  --schema=../../packages/database/prisma/schema.prisma; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $RETRIES ]; then
    echo "Migration failed after $RETRIES attempts. Aborting."
    exit 1
  fi
  echo "Migration failed (attempt $COUNT/$RETRIES). Retrying in 5s..."
  sleep 5
done

echo "Migrations applied. Starting API..."
exec node dist/main
