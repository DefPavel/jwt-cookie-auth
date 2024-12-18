import Link from 'next/link';
import Image from 'next/image';

import AuthForm from '@/components/auth/auth-form';
import { Separator } from '@/components/ui/separator';

export default function AuthPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Авторизация</h1>
            <p className="text-sm text-muted-foreground">
              Для продолжения введите свои данные или зарегистрируйтесь.
            </p>
            <Separator />
          </div>
          {/* Форма Авторизации */}
          <AuthForm />
          <Separator />
          <div className="text-center text-sm">
            У вас нет аккаунта?{' '}
            <Link
              href="/register"
              className="underline text-blue-500 hover:text-blue-700"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <Image
          src="/otp-security.svg"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          loading="lazy" // Ленивый способ загрузки
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
