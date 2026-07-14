const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: "admin@careflow.com",
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@careflow.com",
      password: hashedPassword,
      phone: "9999999999",
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());