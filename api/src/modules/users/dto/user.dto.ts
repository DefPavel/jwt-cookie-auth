import { Gender } from '@common/types/gender';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Укажите Отчество пользователя' })
  readonly firstName: string;

  @IsNotEmpty({ message: 'Укажите Фамилию пользователя' })
  readonly lastName: string;

  @IsNotEmpty({ message: 'Укажите Имя пользователя' })
  readonly name: string;

  @IsEnum(['0', '1'], { message: 'Не верный тип ввода gender' })
  readonly gender: Gender;

  @IsNotEmpty({ message: 'Укажите адрес электронной почты' })
  @IsEmail({}, { message: 'Введите действительный адрес электронной почты' })
  readonly email: string;

  @IsNotEmpty({ message: 'Укажите пароль' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message:
      'Пароль должен содержать как минимум одну цифру, одну букву верхнего и нижнего регистра, и один спец символ',
  })
  readonly password: string;
}
