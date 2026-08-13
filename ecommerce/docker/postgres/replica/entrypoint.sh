#!/bin/bash

set -e

DATA_DIR="/var/lib/postgresql/data"

echo "======================================"
echo " PostgreSQL Replica Initialization"
echo "======================================"

# If PostgreSQL data doesn't exist yet,
# bootstrap this replica from the primary.
if [ ! -s "$DATA_DIR/PG_VERSION" ]; then

    echo "Data directory is empty."
    echo "Creating physical backup from primary..."

    rm -rf "${DATA_DIR:?}"/*

    export PGPASSWORD="$REPLICATION_PASSWORD"

    MAX_RETRIES=10
RETRY_COUNT=0

until pg_basebackup \
    -h "$PRIMARY_HOST" \
    -p "$PRIMARY_PORT" \
    -U "$REPLICATION_USER" \
    -D "$DATA_DIR" \
    -Fp \
    -Xs \
    -P \
    -R
do

    RETRY_COUNT=$((RETRY_COUNT + 1))

    if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
        echo "ERROR: pg_basebackup failed after $MAX_RETRIES attempts."
        exit 1
    fi

    echo "pg_basebackup failed."
    echo "Retrying in 5 seconds... ($RETRY_COUNT/$MAX_RETRIES)"

    rm -rf "${DATA_DIR:?}"/*

    sleep 5
done

    echo "Base backup completed."

    unset PGPASSWORD

else

    echo "Existing PostgreSQL data found."
    echo "Skipping pg_basebackup."

fi
echo "Fixing PostgreSQL data directory permissions..."

chown -R postgres:postgres "$DATA_DIR"
chmod 700 "$DATA_DIR"

echo "Starting PostgreSQL..."

exec gosu postgres postgres -c hot_standby=on