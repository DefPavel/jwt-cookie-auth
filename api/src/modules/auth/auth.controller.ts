import { UserDto } from '@app/users/dto/user.dto';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  HttpCode,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { DoesUserExist } from 'src/guards/doesUserExist.guard';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginAttemptsService } from './login-attempts.service';

/**
 * Контроллер для управления аутентификацией.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private loginAttemptsService: LoginAttemptsService,
  ) {}

  /**
   * Метод для входа пользователя.
   *
   * @param dto - DTO для аутентификации.
   * @param res - Ответ Express.
   * @returns Ответ с токенами и информацией о пользователе.
   */
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: AuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip =
      (req.headers['x-forwarded-for'] as string) || req.ip || '0.0.0.0';

    const attempts = await this.loginAttemptsService.getAttempts(ip);
    if (attempts >= 5) {
      throw new BadRequestException(
        'Слишком много неуспешных попыток входа. Пожалуйста, попробуйте позже.',
      );
    }
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
  @HttpCode(200)
  @UseGuards(DoesUserExist)
  async register(
    @Body() dto: UserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { refreshToken, ...response } =
        await this.authService.register(dto);
      this.authService.addRefreshTokenToResponse(res, refreshToken);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Метод для получения новых токенов доступа.
   *
   * @param req - Запрос Express.
   * @param res - Ответ Express.
   * @returns Ответ с новыми токенами и информацией о пользователе.
   */
  @Post('login/access-token')
  @HttpCode(200)
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

  @Get('verifyToken')
  async verifyToken(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || (Array.isArray(authHeader) && authHeader.length === 0)) {
      throw new UnauthorizedException('authorization header is missing');
    }
    // Используем первую строку, если authHeader массив, иначе проверяем сам authHeader
    const tokenHeader = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    // Проверяем, начинается ли строка с 'Bearer '
    if (!tokenHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = tokenHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const decoded = await this.authService.verifyToken(token);
    return { isValid: true, user: decoded };
  }

  /**
   * Метод для выхода пользователя.
   *
   * @param res - Ответ Express.
   * @returns Истина, если выход успешен.
   */
  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }
}
