import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { NaturalezasController } from './naturalezas.controller.js';
import { NaturalezasService } from './naturalezas.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [NaturalezasController],
  providers: [NaturalezasService],
  exports: [NaturalezasService],
})
export class NaturalezasModule {}
