import { UserDto } from '@app/users/dto/user.dto';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { DoesUserExist } from 'src/guards/doesUserExist.guard';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

/**
 * Контроллер для управления аутентификацией.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  /**
   * Метод для входа пользователя.
   *
   * @param dto - DTO для аутентификации.
   * @param res - Ответ Express.
   * @returns Ответ с токенами и информацией о пользователе.
   */
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  /**
   * Метод для регистрации нового пользователя.
   *
   * @param dto - DTO для регистрации пользователя.
   * @param res - Ответ Express.
   * @returns Ответ с токенами и информацией о пользователе.
   */
  @Post('register')
  @UseGuards(DoesUserExist)
  async register(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  /**
   * Метод для получения новых токенов доступа.
   *
   * @param req - Запрос Express.
   * @param res - Ответ Express.
   * @returns Ответ с новыми токенами и информацией о пользователе.
   */
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies =
      req.cookies[this.configService.get('REFRESH_TOKEN_NAME')];

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token not passed');
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  /**
   * Метод для выхода пользователя.
   *
   * @param res - Ответ Express.
   * @returns Истина, если выход успешен.
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }
}
