import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { CuentasModule } from './cuentas/cuentas.module.js';
import { NaturalezasModule } from './naturalezas/naturalezas.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CuentasModule,
    NaturalezasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
