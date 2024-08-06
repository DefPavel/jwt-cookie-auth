import { User } from '@app/users/entity/user.entity';
import { DataValues } from '@common/types/data-values';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Response } from 'express';

import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

/**
 * Сервис, ответственный за обработку операций аутентификации.
 */
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private userService: UsersService,
  ) {}

  private getEnvData(): {
    REFRESH_TOKEN_NAME: string;
    EXPIRE_DAY_REFRESH_TOKEN: number;
  } {
    const EXPIRE_DAY_REFRESH_TOKEN = this.configService.get(
      'EXPIRE_DAY_REFRESH_TOKEN',
    );
    const REFRESH_TOKEN_NAME = this.configService.get('REFRESH_TOKEN_NAME');

    if (!EXPIRE_DAY_REFRESH_TOKEN || !REFRESH_TOKEN_NAME)
      throw new UnauthorizedException(
        'Invalid value .env REFRESH_TOKEN_NAME or EXPIRE_DAY_REFRESH_TOKEN',
      );

    return { REFRESH_TOKEN_NAME, EXPIRE_DAY_REFRESH_TOKEN };
  }
  async login(dto: AuthDto) {
    const { ...user } = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async register(dto: UserDto) {
    const hashPassword = await this.hashPassword(dto.password);
    const { ...user } = await this.userService.create({
      ...dto,
      password: hashPassword,
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { ...user } = await this.userService.findOneById(result.id);

    const tokens = await this.issueTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };

    // жизнь токена максимум на 1 час
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    // жизнь токена на 1 день
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user: DataValues<User> | null = await this.userService.findOneByEmail(
      dto.email,
    );

    if (!user)
      throw new UnauthorizedException('Данный пользователь не найден!');

    const isValid = await verify(user.dataValues.password, dto.password);

    console.log(isValid);

    if (!isValid) throw new UnauthorizedException('Неверный пароль!');

    return user.dataValues;
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password);
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();

    expiresIn.setDate(
      expiresIn.getDate() + this.getEnvData().EXPIRE_DAY_REFRESH_TOKEN,
    );

    res.cookie(this.getEnvData().REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: false,
      domain: 'localhost',
      expires: expiresIn,
      // true if production
      secure: true,
      // lax if production
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.getEnvData().REFRESH_TOKEN_NAME, '', {
      httpOnly: false,
      domain: 'localhost',
      expires: new Date(0),
      // true if production
      secure: true,
      // lax if production
      sameSite: 'none',
    });
  }
}
