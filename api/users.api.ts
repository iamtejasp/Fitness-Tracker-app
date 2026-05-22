import { axiosInstance } from './axiosInstance';
import { normalizeUser } from './normalizers';
import { UpdateProfileRequest, User } from '@/types/api';

export async function getProfile(): Promise<User> {
  const { data } = await axiosInstance.get<User>('/users/profile');

  return normalizeUser(data);
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<User> {
  const { data } = await axiosInstance.patch<User>('/users/profile', payload);

  return normalizeUser(data);
}
