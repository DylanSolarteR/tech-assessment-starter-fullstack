import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class NaturalezasService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.naturaleza.findMany({ orderBy: { id: 'asc' } });
  }
}
