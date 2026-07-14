const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Skipping manual migration: repository must follow Prisma schema as source-of-truth.');
  } catch (err) {
    console.error('Manual migration failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
