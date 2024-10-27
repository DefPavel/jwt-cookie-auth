import { getJwtConfig } from '@config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LoginAttemptsService } from './login-attempts.service';
import { RedisModule } from '@database/redis.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  providers: [AuthService, JwtStrategy, LoginAttemptsService],
  controllers: [AuthController],
})
export class AuthModule {}
