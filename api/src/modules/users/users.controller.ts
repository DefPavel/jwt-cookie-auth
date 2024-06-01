import { Auth } from '@app/auth/auth.decorator';
import { Controller, Get, Query } from '@nestjs/common';

import { UsersService } from './users.service';

/**
 * Контроллер для управления пользователями.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
   * Метод для получения списка пользователей с пагинацией.
   *
   * @param limit - Максимальное количество пользователей на странице.
   * @param offset - Смещение для пагинации.
   * @returns Список пользователей.
   */
  @Auth()
  @Get('all')
  async getList(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.userService.findAll(limit, offset);
  }
}
