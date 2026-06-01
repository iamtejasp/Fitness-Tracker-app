import { useMutation } from '@tanstack/react-query';
import { forgotPassword, resetPassword, verifyResetOtp } from '@/api/auth.api';
import { useAuth } from '@/context/AuthContext';

export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: login,
  });
}

export function useRegisterMutation() {
  const { register } = useAuth();

  return useMutation({
    mutationFn: register,
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useVerifyResetOtpMutation() {
  return useMutation({
    mutationFn: verifyResetOtp,
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
