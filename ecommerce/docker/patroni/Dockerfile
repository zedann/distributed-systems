FROM postgres:17

RUN apt-get update \
    && apt-get install -y \
        python3 \
        python3-pip \
        curl \
        gosu \
    && pip3 install --break-system-packages \
        "patroni[etcd3]" \
        "psycopg[binary]" \
    && rm -rf /var/lib/apt/lists/*

COPY patroni.yml /etc/patroni/patroni.yml.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
    && chown postgres:postgres /etc/patroni/patroni.yml.template

ENTRYPOINT ["/entrypoint.sh"]