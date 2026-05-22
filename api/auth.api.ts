import { axiosInstance } from './axiosInstance';
import { normalizeUser } from './normalizers';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api';

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload);

  return {
    accessToken: data.accessToken,
    user: normalizeUser(data.user),
  };
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);

  return {
    accessToken: data.accessToken,
    user: normalizeUser(data.user),
  };
}

export async function getMe(): Promise<User> {
  const { data } = await axiosInstance.get<User>('/auth/me');

  return normalizeUser(data);
}
