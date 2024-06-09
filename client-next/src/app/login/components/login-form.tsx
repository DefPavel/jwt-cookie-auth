'use client'

import { saveTokenStorage } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { IFormData } from '@/services/auth/auth.types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import SubmitButton from './submit-button'

interface AuthFormProps {
	isLogin: boolean
}

const AuthForm: FC<AuthFormProps> = ({ isLogin }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IFormData>()
	const { push } = useRouter()

	const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
		mutationKey: ['login'],
		mutationFn: (data: IFormData) => authService.main('login', data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			reset()
			push('/')
		},
	})

	const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
		mutationKey: ['register'],
		mutationFn: (data: IFormData) => authService.main('register', data),
		onSuccess({ data }) {
			saveTokenStorage(data.accessToken)
			reset()
			push('/')
		},
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
					Email
				</label>
				<input
					id='email'
					name='email'
					type='email'
					placeholder='user@acme.com'
					autoComplete='email'
					required
					className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
				/>
			</div>

			<div>
				<label
					htmlFor='password'
					className='block text-xs text-gray-600 uppercase'
				>
					Password
				</label>
				<input
					id='password'
					name='password'
					type='password'
					placeholder='*******'
					required
					className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm'
				/>
			</div>

			<div className='mb-4'>
				<SubmitButton>Sign in</SubmitButton>
			</div>
		</form>
	)
}

export default AuthForm
