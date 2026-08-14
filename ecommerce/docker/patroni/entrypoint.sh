#!/bin/bash
set -e

# Fix PostgreSQL data directory permissions
mkdir -p /var/lib/postgresql/data
chown postgres:postgres /var/lib/postgresql/data
chmod 700 /var/lib/postgresql/data

# Generate Patroni configuration
sed \
  -e "s/__PATRONI_NAME__/${PATRONI_NAME}/g" \
  /etc/patroni/patroni.yml.template \
  > /tmp/patroni.yml

chown postgres:postgres /tmp/patroni.yml
chmod 600 /tmp/patroni.yml

# Drop privileges and start Patroni
exec gosu postgres patroni /tmp/patroni.yml