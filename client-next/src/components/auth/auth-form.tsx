'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { FC, useCallback, useEffect, useState } from 'react';
import { ExclamationTriangleIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import LoadButton from '@/components/ui/load-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { authService } from '@/services/auth/auth.service';
import { IFormData } from '@/types/auth.types';
import { saveTokenStorage } from '@/services/auth/auth.helper';
import { useAuth } from '@/context/authContext';

// Определяем схему валидации с помощью Zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Не указана почта' })
    .email({ message: 'Некорректный формат email' }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен быть не меньше 8 символов' })
    .max(30, { message: 'Пароль не должен превышать 30 символов' })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
      message:
        'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
    }),
});

const AuthForm: FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading, refreshAuthStatus } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Инициализируем форму с использованием React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Функция для перенаправления пользователя, если он уже авторизован
  const redirectIfAuthenticated = useCallback(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Проверяем статус авторизации при загрузке компонента
  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  // Настройка мутации для входа
  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: IFormData) => authService.login(data),
    async onSuccess({ accessToken }) {
      saveTokenStorage(accessToken); // Сохраняем токен в локальное хранилище
      await refreshAuthStatus(); // Обновляем статус авторизации
      form.reset(); // Очищаем форму
      router.push('/dashboard'); // Перенаправляем на главную страницу
    },
    onError: error => {
      setErrorMessage(`${error}`);
    },
  });

  // Обработчик отправки формы
  const onSubmit: SubmitHandler<IFormData> = data => {
    mutateLogin(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {/* Поле ввода для email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Введите email</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Поле ввода для пароля */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Введите пароль</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="password" placeholder="••••••••••" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadButton loading={isLoginPending} type="submit" className="w-full">
          <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
          Войти
        </LoadButton>
      </form>
      {/* Отображение сообщения об ошибке */}
      {errorMessage && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </Form>
  );
};

export default AuthForm;
