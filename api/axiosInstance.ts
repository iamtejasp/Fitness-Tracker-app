import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { clearAccessToken, getAccessToken } from '@/lib/authToken';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearAccessToken();
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    if (Array.isArray(responseMessage?.message)) {
      return responseMessage.message.join('\n');
    }

    return responseMessage?.message ?? responseMessage?.error ?? error.message;
  }

  return error instanceof Error ? error.message : 'Something went wrong';
}
