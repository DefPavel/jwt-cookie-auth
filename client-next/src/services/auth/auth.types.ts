import { IUser } from '@/common/types'

export interface IAuthResponse {
	accessToken: string
	user: IUser
}

export interface IFormData {
	email: string
	password: string
}
