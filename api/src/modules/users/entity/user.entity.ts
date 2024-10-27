import { Gender } from '@common/types/gender';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING(80),
    allowNull: false,
    comment: 'Фамилия пользователя',
  })
  lastName: string;

  @Column({
    type: DataType.STRING(35),
    allowNull: false,
    comment: 'Имя пользователя',
  })
  name: string;

  @Column({
    type: DataType.STRING(85),
    allowNull: false,
    comment: 'Отчество пользователя',
  })
  firstName: string;

  @Column({
    type: DataType.STRING(),
    unique: true,
    allowNull: false,
    comment: 'Почта пользователя',
  })
  email: string;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
    comment: 'Пароль пользователя',
  })
  password: string;

  @Column({
    type: DataType.SMALLINT(),
    allowNull: false,
    comment: 'Пол',
  })
  gender: Gender;
}
