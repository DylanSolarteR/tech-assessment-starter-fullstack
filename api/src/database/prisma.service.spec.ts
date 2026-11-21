import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  function createService(): PrismaService {
    return new PrismaService(
      new ConfigService({
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      }),
    );
  }

  it('rejects missing database configuration', () => {
    vi.stubEnv('DATABASE_URL', undefined);

    expect(() => new PrismaService(new ConfigService())).toThrow(
      'DATABASE_URL',
    );
  });

  it('propagates connection failures during module initialization', async () => {
    const service = createService();
    const connectionError = new Error('Database unavailable');
    vi.spyOn(service, '$connect').mockRejectedValue(connectionError);

    await expect(service.onModuleInit()).rejects.toBe(connectionError);
  });

  it('disconnects when the module is destroyed', async () => {
    const service = createService();
    const disconnect = vi.spyOn(service, '$disconnect').mockResolvedValue();

    await service.onModuleDestroy();

    expect(disconnect).toHaveBeenCalledOnce();
  });
});
