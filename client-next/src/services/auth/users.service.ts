import { instance } from '@/services/api/axios';
import { IUser } from '@/types/user.types';

export const userService = {
  async getAllUsers() {
    try {
      return await instance.get<IUser[]>('/users/all');
    } catch (error) {
      console.warn('get users failed:', error); // Логируем ошибку
    }
  },
};
