import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty({ message: 'Пожалуйста, укажите адрес электронной почты' })
  @IsEmail(
    {},
    { message: 'Пожалуйста, введите действительный адрес электронной почты' },
  )
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Пожалуйста, укажите пароль' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message:
      'Пароль должен содержать как минимум одну цифру, одну букву верхнего и нижнего регистра, и один спец символ',
  })
  password: string;
}
