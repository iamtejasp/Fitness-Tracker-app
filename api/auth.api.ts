import { axiosInstance } from './axiosInstance';
import { normalizeUser } from './normalizers';
import {
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
} from '@/types/api';

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

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const { data } = await axiosInstance.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    payload,
  );

  return data;
}

export async function verifyResetOtp(
  payload: VerifyResetOtpRequest,
): Promise<VerifyResetOtpResponse> {
  const { data } = await axiosInstance.post<VerifyResetOtpResponse>(
    '/auth/verify-reset-otp',
    payload,
  );

  return data;
}

export async function resetPassword(
  payload: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    '/auth/reset-password',
    payload,
  );

  return data;
}
