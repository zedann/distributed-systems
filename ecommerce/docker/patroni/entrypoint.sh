#!/bin/bash
set -e

sed \
  -e "s/__PATRONI_NAME__/${PATRONI_NAME}/g" \
  /etc/patroni/patroni.yml.template \
  > /tmp/patroni.yml

exec patroni /tmp/patroni.yml