'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { FC, useState } from 'react';
import { ExclamationTriangleIcon, PersonIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const formSchema = z.object({
  email: z
    .string()
    .max(255)
    .min(1, {
      message: 'Не указана почта',
    })
    .email({
      message: 'Некорректный формат email',
    }),
  password: z
    .string()
    .min(8, { message: 'Пароль должен быть не меньше 8 символов' })
    .max(30, { message: 'Пароль не должен превышать 30 символов' })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
      message:
        'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
    }),
  firstName: z.string().max(80).min(1, {
    message: 'Не указано отчество',
  }),
  name: z.string().max(35).min(1, {
    message: 'Не указано имя',
  }),
  lastName: z.string().max(85).min(1, {
    message: 'Не указано фамилия',
  }),
  gender: z.enum(['1', '0']),
});

const RegisterForm: FC = () => {
  const { push } = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      name: '',
      lastName: '',
      gender: '1',
    },
  });

  const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
    mutationKey: ['register'],
    mutationFn: (data: IFormData) => authService.register(data),
    onSuccess({ accessToken }) {
      // записываем токен
      saveTokenStorage(accessToken);
      // очищаем форму
      form.reset();
      // переходим дальше
      push('/auth');
    },
    onError: error => {
      // Обработка ошибки
      setErrorMessage(`${error}`);
    },
  });

  const onSubmit: SubmitHandler<IFormData> = data => {
    mutateRegister(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Введите фамилию</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="Иванов" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Введите имя</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="Иван" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Введите отчество</FormLabel>
              <FormMessage />
              <FormControl>
                <Input type="text" placeholder="Иванович" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Выбрать пол</FormLabel>
              <FormMessage />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Не указано" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Мужской</SelectItem>
                  <SelectItem value="0">Женский</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <LoadButton
          loading={isRegisterPending}
          type="submit"
          className="w-full"
        >
          <PersonIcon className="h-5 w-5" aria-hidden="true" />
          Регистрация
        </LoadButton>
      </form>
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

export default RegisterForm;
