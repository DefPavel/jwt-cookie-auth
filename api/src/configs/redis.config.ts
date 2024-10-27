import { ConfigService } from '@nestjs/config';

export const getRedisConfig = async (
  configService: ConfigService,
): Promise<{ host: string; port: number; password?: string }> => ({
  host: configService.get('REDIS_HOST') || 'redis',
  port: Number(configService.get('REDIS_PORT')) || 6379,
  password: configService.get('REDIS_PASSWORD'),
});
