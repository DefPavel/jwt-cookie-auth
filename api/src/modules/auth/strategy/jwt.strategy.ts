import { UsersService } from '@app/users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Стратегия аутентификации с использованием JWT.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_KEY'),
    });
  }
  /**
   * Метод валидации, вызываемый Passport для проверки токена.
   *
   * @param payload - Полезная нагрузка JWT, содержащая идентификатор пользователя.
   * @returns Пользователь, найденный по идентификатору.
   */
  async validate({ id }: { id: number }) {
    return this.userService.findOneById(id);
  }
}
