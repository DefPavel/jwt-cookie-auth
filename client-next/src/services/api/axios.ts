import axios, { AxiosResponse, CreateAxiosDefaults } from 'axios';

import { getAccessToken, removeFromStorage } from '../auth/auth.helper';
import { authService } from '../auth/auth.service';

import { AxiosCustomError, errorCatch, getHeaders } from './api.helper';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getHeaders(),
  timeout: 10000,
  withCredentials: true,
};

// Базовый экземпляр для неавторизованных запросов
export const axiosClassic = axios.create(axiosOptions);

// Авторизованный экземпляр
export const instance = axios.create(axiosOptions);

// добавления токена в заголовки
instance.interceptors.request.use(config => {
  const accessToken = getAccessToken();
  if (config?.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// обработки ответов и 401 ошибок
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // Возвращаем только поле data
  },
  async error => {
    const originalRequest = error.config;

    // Обработка 401 ошибки и истекшего токена
    if (
      (error?.response?.status === 401 ||
        errorCatch(error) === 'jwt expired' ||
        errorCatch(error) === 'jwt must be provided') &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await authService.getNewTokens();
        return instance.request(originalRequest);
      } catch (retryError) {
        const axiosError = retryError as AxiosCustomError;
        if (errorCatch(axiosError) === 'jwt expired') removeFromStorage();
      }
    }

    throw error;
  },
);
