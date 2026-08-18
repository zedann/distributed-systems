import { PrismaClient } from "../../generated/client";

console.log("[DB] Initializing Prisma clients...");

export const primaryPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_PRIMARY_URL,
    },
  },
  log: ["query", "info", "warn", "error"],
});

process.on("beforeExit", async () => {
  console.log("[DB] Primary connection closing");
  await primaryPrisma.$disconnect();
});


primaryPrisma
  .$connect()
  .then(() => {
    console.log("[DB] Primary database connected successfully");
  })
  .catch((error) => {
    console.error("[DB] Primary database connection failed:", error.message);
  });

export const readPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_URL,
    },
  },
  log: ["query", "info", "warn", "error"],
});

process.on("beforeExit", async () => {
  console.log("[DB] Read connection closing");
  await readPrisma.$disconnect();
});


readPrisma
  .$connect()
  .then(() => {
    console.log("[DB] Read database connected successfully");
  })
  .catch((error) => {
    console.error("[DB] Read database connection failed:", error.message);
  });
