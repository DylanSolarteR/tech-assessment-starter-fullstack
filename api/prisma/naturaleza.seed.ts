import type { Prisma } from '../src/generated/prisma/client.js';

export type NaturalezaIds = Record<'debito' | 'credito', number>;

export async function seedNaturalezas(
  prisma: Prisma.TransactionClient,
): Promise<NaturalezaIds> {
  async function obtenerOCrear(nombre: string): Promise<number> {
    const existente = await prisma.naturaleza.findFirst({
      where: { nombre },
      orderBy: { id: 'asc' },
    });
    const naturaleza =
      existente ?? (await prisma.naturaleza.create({ data: { nombre } }));

    return naturaleza.id;
  }

  return {
    debito: await obtenerOCrear('Débito'),
    credito: await obtenerOCrear('Crédito'),
  };
}
