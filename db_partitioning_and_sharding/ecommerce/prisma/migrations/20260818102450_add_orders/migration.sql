-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id","createdAt")
) PARTITION BY RANGE ("createdAt");

CREATE TABLE "orders_2026"
PARTITION OF "orders"
FOR VALUES FROM ('2026-01-01')
TO ('2027-01-01');

CREATE TABLE "orders_2027"
PARTITION OF "orders"
FOR VALUES FROM ('2027-01-01')
TO ('2028-01-01');

CREATE TABLE "orders_2028"
PARTITION OF "orders"
FOR VALUES FROM ('2028-01-01')
TO ('2029-01-01');

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");
