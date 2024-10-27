// login-attempts.service.ts
import { REDIS_CONNECTION } from '@common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class LoginAttemptsService {
  constructor(@Inject(REDIS_CONNECTION) private readonly redis: Redis) {}

  async getAttempts(ip: string): Promise<number> {
    const attempts = await this.redis.get(ip);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  async incrementAttempts(ip: string): Promise<number> {
    const attempts = await this.redis.incr(ip);
    await this.redis.expire(ip, 300); // Сбросить счетчик через 5 минут
    return attempts;
  }

  async resetAttempts(ip: string): Promise<void> {
    await this.redis.del(ip);
  }
}
