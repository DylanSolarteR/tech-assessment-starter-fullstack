import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { CuentasController } from './cuentas.controller.js';
import { CuentasService } from './cuentas.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CuentasController],
  providers: [CuentasService],
  exports: [CuentasService],
})
export class CuentasModule {}
