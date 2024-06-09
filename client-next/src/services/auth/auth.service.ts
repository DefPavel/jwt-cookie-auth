import { axiosClassic, instance } from '@/utils/api/axios'
import { removeFromStorage, saveTokenStorage } from './auth.helper'
import { IAuthResponse, IFormData } from './auth.types'
import { IUser } from '@/common/types'

export const authService = {
	async main(type: 'login' | 'register', data: IFormData) {
		const response = await axiosClassic.post<IAuthResponse>(
			`/auth/${type}`,
			data
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async getNewTokens() {
		const response = await axiosClassic.post<IAuthResponse>(
			'/auth/login/access-token'
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async logout() {
		const response = await axiosClassic.post<boolean>('/auth/logout')

		if (response.data) removeFromStorage()

		return response
	},

	async users() {
		return instance.get<IUser[]>(`/auth/users`)
	},
}
