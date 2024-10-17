import axios, { CreateAxiosDefaults } from 'axios'
import { errorCatch, getHeaders } from './api.helper'
import { getAccessToken, removeFromStorage } from '../auth/auth.helper'
import { authService } from '../auth/auth.service'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const axiosOptions: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: getHeaders(),
	withCredentials: true,
}

export const axiosClassic = axios.create(axiosOptions)

export const instance = axios.create(axiosOptions)

instance.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

instance.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()
				return instance.request(originalRequest)
			} catch (error) {
				if (errorCatch(error) === 'jwt expired') removeFromStorage()
			}
		}

		throw error
	}
)
