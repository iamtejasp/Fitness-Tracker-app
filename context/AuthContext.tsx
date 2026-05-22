import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { getMe, loginUser, registerUser } from '@/api/auth.api';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/authToken';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isBootstrapping: boolean;
  login: (payload: LoginRequest) => Promise<AuthResponse>;
  register: (payload: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const storedToken = await getAccessToken();

        if (!storedToken) {
          return;
        }

        const profile = await getMe();

        if (isMounted) {
          setToken(storedToken);
          setUser(profile);
          queryClient.setQueryData(queryKeys.authUser, profile);
          router.replace('/(tabs)');
        }
      } catch {
        await clearAccessToken();
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAuthResponse(response: AuthResponse) {
    await setAccessToken(response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
    queryClient.setQueryData(queryKeys.authUser, response.user);
    router.replace('/(tabs)');

    return response;
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isBootstrapping,
      login: async (payload) => handleAuthResponse(await loginUser(payload)),
      register: async (payload) => handleAuthResponse(await registerUser(payload)),
      logout: async () => {
        await clearAccessToken();
        setToken(null);
        setUser(null);
        queryClient.clear();
        router.replace('/login');
      },
      setUser,
    }),
    [isBootstrapping, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export function getReadableAuthError(error: unknown) {
  return getApiErrorMessage(error);
}
