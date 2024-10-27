import { REDIS_CONNECTION } from '@common/constants';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProviders = {
  provide: REDIS_CONNECTION,
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST') || 'redis';
    const port = configService.get<number>('REDIS_PORT') || 6379;
    const password = configService.get<string>('REDIS_PASSWORD');

    return new Redis({
      host,
      port,
      password,
    });
  },
  inject: [ConfigService],
};
