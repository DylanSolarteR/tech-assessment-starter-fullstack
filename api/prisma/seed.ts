import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { seedCuentas } from './cuenta.seed.js';
import { seedNaturalezas } from './naturaleza.seed.js';

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Configura DATABASE_URL antes de ejecutar el seed.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    await prisma.$transaction(async (transaction) => {
      const naturalezas = await seedNaturalezas(transaction);
      await seedCuentas(transaction, naturalezas);
    });
    console.log('Seed completado: 2 naturalezas y 8 cuentas con su jerarquía.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : 'No se pudo cargar el seed.',
  );
  process.exitCode = 1;
});
