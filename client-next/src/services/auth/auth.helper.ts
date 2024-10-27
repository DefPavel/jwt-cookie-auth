import Cookies from 'js-cookie';

import { instance } from '../api/axios';

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

export const checkAuth = async (): Promise<boolean> => {
  const token = getAccessToken();

  if (!token) return false; // Токена нет

  try {
    const response = await instance.get('/auth/verifyToken', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || false; // Возвращаем результат проверки
  } catch (error) {
    console.error('Authorization check failed:', error); // Логируем ошибку
    return false;
  }
};

export const getAccessToken = () => {
  if (!ACCESS_TOKEN) return null;
  return Cookies.get(ACCESS_TOKEN) || null;
};

export const saveTokenStorage = (accessToken: string) => {
  if (!ACCESS_TOKEN) return;
  Cookies.set(ACCESS_TOKEN, accessToken, {
    domain: 'localhost',
    sameSite: 'strict',
    expires: 1,
  });
};

export const removeFromStorage = () => {
  if (!ACCESS_TOKEN) return;
  Cookies.remove(ACCESS_TOKEN);
};
