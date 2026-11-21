import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { Prisma } from '../generated/prisma/client.js';
import type { CreateCuentaDto } from './dto/create-cuenta.dto.js';

@Injectable()
export class CuentasService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cuenta.findMany({
      orderBy: { codigo: 'asc' },
      include: { naturaleza: true },
    });
  }

  async create(data: CreateCuentaDto) {
    try {
      return await this.prisma.cuenta.create({
        data: {
          codigo: data.codigo,
          nombre: data.nombre,
          naturalezaId: data.naturalezaId,
          cuentaPadreId: data.cuentaPadreId,
          active: data.active,
        },
        include: { naturaleza: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Ya existe una cuenta con ese código.');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'La naturaleza o la cuenta padre no existe.',
          );
        }
      }
      throw error;
    }
  }
}
