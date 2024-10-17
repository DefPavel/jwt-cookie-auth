import 'dotenv/config'

export const API_URL = process.env.API_URL || 'http://localhost:4000/api'
export const IS_CLIENT = typeof window !== 'undefined'
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'accessToken'
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'refreshToken'
