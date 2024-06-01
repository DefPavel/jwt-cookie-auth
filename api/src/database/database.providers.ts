import { User } from '@app/users/entity/user.entity';
import { SEQUELIZE } from '@common/constants';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        pool: {
          max: 50, // Максимальное количество соединений в пуле
          min: 0, // Минимальное количество соединений в пуле
          acquire: 30000, // Максимальное время ожидания соединения (мс)
          idle: 10000, // Время, после которого неактивное соединение будет удалено из пула (мс)
        },
      });
      sequelize.drop();
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
