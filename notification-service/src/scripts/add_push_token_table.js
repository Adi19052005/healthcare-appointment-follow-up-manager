require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.$connect();
    console.log('DB connected');

    const sql = `CREATE TABLE IF NOT EXISTS "PushToken" (
      "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" TEXT NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "platform" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;

    await prisma.$executeRawUnsafe(sql);
    console.log('PushToken table ensured');
  } catch (err) {
    console.error('Failed to ensure PushToken table:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
