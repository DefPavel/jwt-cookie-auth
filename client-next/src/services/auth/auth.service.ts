import { AxiosCustomError, errorCatch } from '@/services/api/api.helper';
import {
  getAccessToken,
  removeFromStorage,
  saveTokenStorage,
} from '@/services/auth/auth.helper';
import { axiosClassic } from '@/services/api/axios';
import { IAuthResponse, IFormData } from '@/types/auth.types';

const handleAuthResponse = (response: IAuthResponse) => {
  if (response.accessToken) {
    saveTokenStorage(response.accessToken);
  } else {
    console.warn('No access token found in the response.');
  }
};

export const authService = {
  // Логин
  async login(data: IFormData) {
    try {
      const { data: response } = await axiosClassic.post<IAuthResponse>(
        '/auth/login',
        data,
      );
      handleAuthResponse(response);
      return response;
    } catch (error) {
      throw errorCatch(error as AxiosCustomError);
    }
  },

  // Регистрация
  async register(data: IFormData) {
    try {
      const { data: response } = await axiosClassic.post<IAuthResponse>(
        '/auth/register',
        data,
      );
      handleAuthResponse(response);
      return response;
    } catch (error) {
      throw errorCatch(error as AxiosCustomError);
    }
  },

  async checkAuth() {
    const token = getAccessToken();
    if (!token) return { isValid: false }; // Токена нет

    try {
      const { data: response } = await axiosClassic.get<{ isValid: boolean }>(
        '/auth/verifyToken',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response;
    } catch (error) {
      console.warn('Authorization check failed:', error); // Логируем ошибку
      return { isValid: false };
    }
  },
  // Получение нового токена
  async getNewTokens() {
    try {
      const { data: response } = await axiosClassic.post<IAuthResponse>(
        '/auth/login/access-token',
      );
      handleAuthResponse(response);
      return response;
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      throw errorCatch(error as AxiosCustomError);
    }
  },

  async logout() {
    try {
      const { data } = await axiosClassic.post<boolean>('/auth/logout');
      if (data) {
        removeFromStorage();
        console.log('Successfully logged out.');
      } else {
        console.warn('Logout request did not return the expected response.');
      }
      return data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw errorCatch(error as AxiosCustomError);
    }
  },
};
