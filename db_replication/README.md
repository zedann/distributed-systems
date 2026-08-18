# PostgreSQL High-Availability Replication — E-Commerce Demo

A hands-on demonstration of a **production-grade, highly-available PostgreSQL cluster** with automatic failover, connection pooling, and read/write splitting — all consumed by a layered Node.js e-commerce API.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        E-Commerce API                           │
│                     Node.js / Express / Prisma                  │
│                          :3000                                  │
└────────────────────┬───────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
  ┌───────▼──────┐     ┌────────▼──────┐
  │ PgBouncer    │     │  PgBouncer    │
  │  WRITE       │     │    READ       │
  │  :6432       │     │   :6433       │
  └───────┬──────┘     └────────┬──────┘
          │                     │
          └──────────┬──────────┘
                     │
            ┌────────▼────────┐
            │    HAProxy      │
            │  write → :5432  │
            │  read  → :5433  │
            └───┬─────────────┘
                │
   ┌────────────┼────────────┐
   │            │            │
┌──▼──┐     ┌──▼──┐     ┌───▼─┐
│ PG1 │     │ PG2 │     │ PG3 │   ← Patroni-managed
│     │     │     │     │     │     PostgreSQL nodes
└──┬──┘     └──┬──┘     └──┬──┘
   └─────┬──────┘           │
         │     etcd cluster │
    ┌────▼──────────────────▼────┐
    │  etcd1  │  etcd2  │  etcd3 │   ← Distributed consensus
    └─────────────────────────────┘
```

### Component Responsibilities

| Component | Role |
|-----------|------|
| **etcd** (×3) | Distributed key-value store. Provides the consensus quorum that Patroni uses to elect and track the primary node |
| **Patroni** (×3) | HA agent running on each PostgreSQL node. Manages leader election, replication, and automatic failover |
| **HAProxy** | Routes write traffic exclusively to the Patroni primary (via `/primary` health check on port 8008) and distributes read traffic across all healthy nodes round-robin (via `/health`) |
| **PgBouncer Write** | Connection pool in front of the HAProxy write endpoint — reduces connection overhead for write queries |
| **PgBouncer Read** | Connection pool in front of the HAProxy read endpoint — reduces connection overhead for read queries |
| **E-Commerce App** | Node.js API using two separate Prisma clients — one pointed at the write pool, one at the read pool |

---

## Port Map

| Port (host) | Container | Description |
|-------------|-----------|-------------|
| `3000` | `ecommerce-app` | REST API |
| `5432` | `postgres1` | Direct PostgreSQL node 1 |
| `5433` | `postgres2` | Direct PostgreSQL node 2 |
| `5434` | `postgres3` | Direct PostgreSQL node 3 |
| `5435` | `haproxy` | HAProxy → primary (write) |
| `5436` | `haproxy` | HAProxy → all nodes (read) |
| `6432` | `pgbouncer-write` | Pooled write connection |
| `6433` | `pgbouncer-read` | Pooled read connection |
| `8001` | `postgres1` | Patroni REST API |
| `8002` | `postgres2` | Patroni REST API |
| `8003` | `postgres3` | Patroni REST API |

---

## E-Commerce API

### Tech Stack

- **Runtime**: Node.js 22 + TypeScript
- **Framework**: Express 5
- **ORM**: Prisma 6 (`prisma-client` generator, custom output to `src/generated`)
- **Architecture**: Clean Architecture (Controller → Service → Repository)

### Project Structure

```
ecommerce/
├── prisma/
│   ├── schema.prisma          # Database schema & generator config
│   └── migrations/            # SQL migration history
├── src/
│   ├── domain/                # Entities & repository interfaces
│   │   ├── product/
│   │   └── order/
│   ├── application/           # Use-case classes (business logic)
│   │   ├── product/
│   │   └── order/
│   ├── infrastructure/        # Prisma clients & repository implementations
│   │   ├── database/prisma.ts # primaryPrisma (write) + readPrisma (read)
│   │   └── repositories/
│   ├── presentation/          # Express controllers & routes
│   │   └── http/
│   ├── container.ts           # Dependency wiring
│   └── server.ts              # App entry point
└── docker/
    ├── patroni/               # Patroni + PostgreSQL image
    ├── haproxy/haproxy.cfg    # HAProxy routing rules
    └── pgbouncer/             # Connection pool configs
```

### Database Schema

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  price     Decimal  @db.Decimal(10, 2)
  stock     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([name])
  @@map("products")
}
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/products` | Create a product |
| `GET` | `/products` | List all products |
| `GET` | `/products/:id` | Get a product by ID |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 22+

### 1. Configure environment

```bash
cp ecommerce/.env.example ecommerce/.env
# Edit DATABASE_PRIMARY_URL and DATABASE_READ_URL
```

Example `.env`:

```env
DATABASE_PRIMARY_URL=postgresql://ecommerce:secret@pgbouncer-write:6432/ecommerce
DATABASE_READ_URL=postgresql://ecommerce:secret@pgbouncer-read:6433/ecommerce
```

### 2. Start the full stack

```bash
cd ecommerce
docker compose up --build
```

This starts etcd cluster → Patroni nodes → HAProxy → PgBouncer → App in the correct dependency order.

### 3. Apply database migrations

Migrations must be run **inside the container** since `pgbouncer-write` is only resolvable on the Docker network:

```bash
docker compose exec app npx prisma migrate deploy
```

### 4. Verify the cluster

Check which node is the Patroni primary:

```bash
curl http://localhost:8001/primary    # 200 = this node is leader
curl http://localhost:8002/primary
curl http://localhost:8003/primary
```

---

## Local Development

To run the app locally (outside Docker) while still using the containerised databases:

```bash
cd ecommerce

# Generate the Prisma client for both local + container platforms
npx prisma generate

# Start the dev server (hot-reload via tsx watch)
npm run dev
```

> **Note**: Use `localhost:6432` / `localhost:6433` (the exposed PgBouncer ports) in your local `.env`.
> The Docker-internal hostnames (`pgbouncer-write`, `pgbouncer-read`) are not resolvable from the host.

---

## How Automatic Failover Works

1. Patroni agents on each node continuously heartbeat to etcd
2. If the primary stops heartbeating, the etcd lease expires
3. Patroni replicas race to acquire the leader lock in etcd
4. The winner promotes itself to primary via `pg_promote()`
5. HAProxy health checks (every few seconds) detect the new primary via the `/primary` endpoint returning `200`
6. New write connections are automatically routed to the new primary — zero manual intervention required

---

## Key Implementation Notes

- **Read/Write Splitting**: `primaryPrisma` (write pool) and `readPrisma` (read pool) are separate Prisma client instances with distinct `datasources` URLs, wired into repository methods as needed.
- **Prisma Binary Targets**: `schema.prisma` includes `binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]` so the generated client works on both macOS (dev) and inside the Alpine Linux container.
- **Connection Pooling**: PgBouncer sits between the app and HAProxy to cap the number of real PostgreSQL connections regardless of how many app instances are running.
- **Migrations from host**: Always run `prisma migrate deploy` via `docker compose exec app` — the `pgbouncer-write` hostname is only resolvable inside the Docker network.
