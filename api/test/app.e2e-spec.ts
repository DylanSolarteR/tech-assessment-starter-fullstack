import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/database/prisma.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const cuenta = {
    id: 50,
    codigo: 1105,
    nombre: 'Caja',
    naturalezaId: 12,
    cuentaPadreId: null,
    active: true,
    createdAt: '2026-11-21T00:00:00.000Z',
    naturaleza: { id: 12, nombre: 'Débito' },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        cuenta: {
          findMany: vi.fn().mockResolvedValue([cuenta]),
          create: vi.fn().mockResolvedValue(cuenta),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/cuentas (GET) returns the general list with its natures', () => {
    return request(app.getHttpServer())
      .get('/cuentas')
      .expect(200)
      .expect([cuenta]);
  });

  it('/cuentas (POST) creates an account', () => {
    return request(app.getHttpServer())
      .post('/cuentas')
      .send({ codigo: 1105, nombre: 'Caja', naturalezaId: 12 })
      .expect(201)
      .expect(cuenta);
  });

  it.each([
    ['get', '/cuentas/50'],
    ['patch', '/cuentas/50'],
    ['delete', '/cuentas/50'],
    ['get', '/naturalezas'],
  ] as const)('does not expose %s %s', async (method, path) => {
    await request(app.getHttpServer())[method](path).expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
