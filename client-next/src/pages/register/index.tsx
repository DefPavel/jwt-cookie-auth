import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Регистрация</h1>
            <p className="text-sm text-muted-foreground">
              Для продолжения введите чтобы зарегистрироваться.
            </p>
            <Separator />
          </div>
          {/* Форма регистрации */}
          <RegisterForm />
          <Separator />
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
