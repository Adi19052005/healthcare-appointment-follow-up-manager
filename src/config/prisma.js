// Ensure environment variables are loaded before PrismaClient instantiation
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    log: ["warn", "error"],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

module.exports = prisma;