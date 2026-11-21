import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateCuentaDto } from './create-cuenta.dto.js';

describe('CreateCuentaDto', () => {
  const valid = { codigo: 1, nombre: 'Activo', naturalezaId: 12 };
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  const metadata = { type: 'body' as const, metatype: CreateCuentaDto };

  it.each([
    { codigo: 1.5 },
    { codigo: 2147483648 },
    { nombre: '   ' },
    { nombre: 'A'.repeat(101) },
    { naturalezaId: null },
    { cuentaPadreId: '1' },
    { active: null },
    { active: 'true' },
    { id: 100 },
  ])('rejects invalid input %j', async (invalid) => {
    await expect(
      pipe.transform({ ...valid, ...invalid }, metadata),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows a root account and an inactive state', async () => {
    const data = { ...valid, cuentaPadreId: null, active: false };

    await expect(pipe.transform(data, metadata)).resolves.toEqual(data);
  });
});
