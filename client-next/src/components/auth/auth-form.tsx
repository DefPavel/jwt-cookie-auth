'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { FC } from 'react'
import { LockClosedIcon } from '@radix-ui/react-icons'
import LoadButton from '../ui/load-button'
import { authService } from '@/services/auth/auth.service'
import { IFormData } from '@/types/ auth.types'
import { saveTokenStorage } from '@/services/auth/auth.helper'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
	email: z.string().email({
		message: 'Некорректный email',
	}),
	password: z
		.string()
		.min(8)
		.max(30, { message: 'Пароль не должен превышать 30 символов' })
		.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
			message:
				'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
		}),
})

const AuthForm: FC = () => {
	const { push } = useRouter()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const { register, handleSubmit, reset } = useForm<IFormData>()

	const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: IFormData) => authService.login(data),
		onSuccess({ accessToken }) {
			saveTokenStorage(accessToken)
			reset()
			push('/')
		},
		onError: handleApiError,
	})

	const onSubmit: SubmitHandler<IFormData> = data => {
		mutateLogin(data)
	}

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem className='grid gap-2'>
							<FormLabel>Введите email</FormLabel>
							<FormControl>
								<Input
									type='email'
									placeholder='m@example.com'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem className='grid gap-2'>
							<FormLabel>Введите пароль</FormLabel>
							<FormControl>
								<Input
									type='text'
									placeholder='*********'
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadButton type='submit' className='w-full'>
					<LockClosedIcon className='h-5 w-5' aria-hidden='true' />
					Войти
				</LoadButton>
			</form>
		</Form>
	)
}

export default AuthForm