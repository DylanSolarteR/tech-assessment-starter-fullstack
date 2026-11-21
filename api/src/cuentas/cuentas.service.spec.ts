import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { CuentasService } from './cuentas.service.js';

describe('CuentasService', () => {
  const data = { codigo: 1105, nombre: 'Caja', naturalezaId: 7 };
  let create: ReturnType<typeof vi.fn>;
  let service: CuentasService;

  beforeEach(() => {
    create = vi.fn();
    service = new CuentasService({
      cuenta: { create },
    } as unknown as PrismaService);
  });

  it('returns a conflict for a duplicate account code', async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Duplicate code', {
        code: 'P2002',
        clientVersion: '7.10.1',
      }),
    );

    await expect(service.create(data)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('rejects nonexistent nature or parent references', async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Missing reference', {
        code: 'P2003',
        clientVersion: '7.10.1',
      }),
    );

    await expect(service.create(data)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('does not hide unexpected database failures as input errors', async () => {
    const error = new Error('Connection unavailable');
    create.mockRejectedValue(error);

    await expect(service.create(data)).rejects.toBe(error);
  });
});
