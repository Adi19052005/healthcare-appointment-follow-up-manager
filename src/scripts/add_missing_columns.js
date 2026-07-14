require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Applying manual migration: add missing appointment columns');

    // Create Severity enum if not exists



      console.log('Skipping manual migration: repository must follow Prisma schema as source-of-truth.');
  } catch (err) {
    console.error('Manual migration failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
