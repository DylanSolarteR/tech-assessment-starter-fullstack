import type { Prisma } from '../src/generated/prisma/client.js';
import type { NaturalezaIds } from './naturaleza.seed.js';

export const cuentasSeed = [
  { codigo: 1, nombre: 'Activo', naturaleza: 'debito', padreCodigo: null },
  { codigo: 11, nombre: 'Disponible', naturaleza: 'debito', padreCodigo: 1 },
  { codigo: 1105, nombre: 'Caja', naturaleza: 'debito', padreCodigo: 11 },
  {
    codigo: 110505,
    nombre: 'Caja general',
    naturaleza: 'debito',
    padreCodigo: 1105,
  },
  {
    codigo: 110510,
    nombre: 'Caja menor',
    naturaleza: 'debito',
    padreCodigo: 1105,
  },
  { codigo: 2, nombre: 'Pasivo', naturaleza: 'credito', padreCodigo: null },
  {
    codigo: 21,
    nombre: 'Obligaciones financieras',
    naturaleza: 'credito',
    padreCodigo: 2,
  },
  {
    codigo: 2105,
    nombre: 'Bancos nacionales',
    naturaleza: 'credito',
    padreCodigo: 21,
  },
] as const;

export async function seedCuentas(
  prisma: Prisma.TransactionClient,
  naturalezas: NaturalezaIds,
): Promise<void> {
  const idsPorCodigo = new Map<number, number>();

  for (const cuenta of cuentasSeed) {
    const cuentaPadreId =
      cuenta.padreCodigo === null ? null : idsPorCodigo.get(cuenta.padreCodigo);

    if (cuentaPadreId === undefined) {
      throw new Error(
        `Falta la cuenta padre ${cuenta.padreCodigo} en el seed.`,
      );
    }

    const data = {
      nombre: cuenta.nombre,
      naturalezaId: naturalezas[cuenta.naturaleza],
      cuentaPadreId,
      active: true,
    };
    const resultado = await prisma.cuenta.upsert({
      where: { codigo: cuenta.codigo },
      create: { codigo: cuenta.codigo, ...data },
      update: data,
    });

    idsPorCodigo.set(cuenta.codigo, resultado.id);
  }
}
