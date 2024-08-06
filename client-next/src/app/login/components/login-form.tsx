'use client'

import { saveTokenStorage } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { IFormData } from '@/services/auth/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import SubmitButton from './submit-button'

interface AuthFormProps {
	isLogin: boolean
}

const AuthForm: FC<AuthFormProps> = ({ isLogin }) => {
	const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
		{}
	)
	const { register, handleSubmit, reset } = useForm<IFormData>()
	const { push } = useRouter()

	const handleApiError = (error: any) => {
		console.error('API error:', error)

		if (error?.response?.data?.errors) {
			// Создание объекта ошибок, которые будут отображены
			const errorsMap: { [key: string]: string } = {}
			error.response.data.errors.forEach(
				(err: { field: string; message: string }) => {
					errorsMap[err.field] = err.message
				}
			)
			setErrorMessages(errorsMap)
		} else {
			setErrorMessages({
				general: 'Не верный email или пароль. Пожалуйста, попробуйте снова.',
			})
		}
	}

	const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: IFormData) => authService.main('login', data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			reset()
			push('/')
		},
		onError: handleApiError,
	})

	const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
		mutationKey: ['register'],
		mutationFn: (data: IFormData) => authService.main('register', data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			reset()
			push('/')
		},
		onError: handleApiError,
	})

	const isPending = isLoginPending || isRegisterPending

	const onSubmit: SubmitHandler<IFormData> = data => {
		isLogin ? mutateLogin(data) : mutateRegister(data)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16'
		>
			<div>
				<label
					htmlFor='email'
					className='block text-xs text-gray-600 uppercase'
				>
					Введите E-mail
				</label>
				{errorMessages.email && (
					<span className='text-red-500 text-xs'>{errorMessages.email}</span>
				)}
				<input
					id='email'
					type='email'
					{...register('email', { required: 'Email обязателен' })}
					placeholder='user@acme.com'
					autoComplete='email'
					className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
				/>
			</div>

			<div>
				<label
					htmlFor='password'
					className='block text-xs text-gray-600 uppercase'
				>
					Введите Пароль
				</label>
				{errorMessages.password && (
					<span className='text-red-500 text-xs'>{errorMessages.password}</span>
				)}
				<input
					id='password'
					{...register('password', { required: 'Пароль обязателен' })}
					type='password'
					placeholder='*******'
					className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
				/>
			</div>

			<div className='mb-4'>
				{errorMessages.general && (
					<p className='text-red-500 text-xs'>{errorMessages.general}</p>
				)}
				<SubmitButton disabled={isPending}>
					{isLogin ? 'Войти' : 'Зарегистрироваться'}
				</SubmitButton>
			</div>
		</form>
	)
}

export default AuthForm
