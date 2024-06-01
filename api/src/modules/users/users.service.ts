import { USER_REPOSITORY } from '@common/constants';
import { Inject, Injectable } from '@nestjs/common';

import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

/**
 * Сервис пользователей, отвечающий за взаимодействие с базой данных пользователей.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  /**
   * Создает нового пользователя.
   * @param {UserDto} user - Данные нового пользователя.
   * @returns {Promise<User>} Созданный пользователь.
   */
  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user as User);
  }

  /**
   * Находит пользователя по электронной почте.
   * @param {string} email - Электронная почта пользователя.
   * @returns {Promise<User>} Найденный пользователь.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  /**
   * Находит пользователя по идентификатору.
   * @param {number} id - Идентификатор пользователя.
   * @returns {Promise<User>} Найденный пользователь.
   */
  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findAll(limit: number, offset: number): Promise<User[] | []> {
    return await this.userRepository.findAll<User>({ limit, offset });
  }
}
