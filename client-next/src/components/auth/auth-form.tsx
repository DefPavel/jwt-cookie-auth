'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { FC } from 'react';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

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

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Не указана почта',
    })
    .email({
      message: 'Некорректный email',
    }),
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
  const { push } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: IFormData) => authService.login(data),
    onSuccess({ accessToken }) {
      // записываем токен
      saveTokenStorage(accessToken);
      // очищаем форму
      form.reset();
      // переходим дальше
      push('/dashboard');
    },
    onError: error => {
      // Обработка ошибки
      console.error('Ошибка при авторизации', error);
    },
  });

  const onSubmit: SubmitHandler<IFormData> = data => {
    mutateLogin(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Email</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Пароль</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="*********" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <LoadButton loading={isLoginPending} type="submit" className="w-full">
          <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
          Войти
        </LoadButton>
      </form>
    </Form>
  );
};

export default AuthForm;
