import Link from 'next/link'
import Image from 'next/image'
import AuthForm from '@/components/auth/auth-form'
import { Separator } from '@/components/ui/separator'

export default function AuthPage() {
	return (
		<div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
			<div className='flex items-center justify-center py-12'>
				<div className='mx-auto grid w-[350px] gap-6'>
					<div className='grid gap-2 text-center'>
						<h1 className='text-2xl font-bold'>Authorization (Next + Nest)</h1>
						<p className='text-sm text-muted-foreground'>
							Введите свои данные, чтобы продолжить
						</p>
						<Separator />
					</div>
					{/* Форма Авторизации */}
					<AuthForm />
					<Separator />
					<div className='mt-4 text-center text-sm'>
						У вас нет аккаунта?{' '}
						<Link
							href='#'
							className='underline text-blue-500 hover:text-blue-700'
						>
							Регистрация
						</Link>
					</div>
				</div>
			</div>
			<div className='hidden bg-muted lg:block'>
				<Image
					src='/Programmer.svg'
					alt=''
					aria-hidden='true'
					width={1920}
					height={1080}
					loading='lazy' // Ленивый способ загрузки
					className='w-full h-full object-cover dark:brightness-[0.2] dark:grayscale'
				/>
			</div>
		</div>
	)
}
