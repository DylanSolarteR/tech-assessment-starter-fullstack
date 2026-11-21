import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { CuentasService } from './cuentas.service.js';
import { CreateCuentaDto } from './dto/create-cuenta.dto.js';

@Controller('cuentas')
export class CuentasController {
  constructor(
    @Inject(CuentasService) private readonly cuentasService: CuentasService,
  ) {}

  @Get()
  findAll() {
    return this.cuentasService.findAll();
  }

  @Post()
  create(@Body() createCuentaDto: CreateCuentaDto) {
    return this.cuentasService.create(createCuentaDto);
  }
}
