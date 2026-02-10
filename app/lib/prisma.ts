import { PrismaClient } from "../generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || typeof databaseUrl !== "string") {
  throw new Error(
    "DATABASE_URL is not set. Add it to Globe-Website/.env and restart the dev server."
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: databaseUrl },
    },
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
