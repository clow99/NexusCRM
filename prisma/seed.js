const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create User
  const user = await prisma.user.upsert({
    where: { email: 'demo@nexus.com' },
    update: {},
    create: {
      email: 'demo@nexus.com',
      name: 'Demo Freelancer',
      passwordHash,
      currency: 'USD',
      timezone: 'America/New_York',
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create Clients
  const client1 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Acme Corp',
      company: 'Acme Inc.',
      email: 'contact@acme.com',
      status: 'active',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'lead',
    },
  });

  // Create Deals
  await prisma.deal.create({
    data: {
      userId: user.id,
      clientId: client1.id,
      title: 'Website Redesign',
      value: 5000,
      stage: 'negotiation',
      probability: 75,
    },
  });

  // Create Tasks
  await prisma.task.create({
    data: {
      userId: user.id,
      clientId: client1.id,
      title: 'Send contract',
      dueDate: new Date(),
      priority: 'high',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
