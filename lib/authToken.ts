import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'fitcoach_access_token';

let inMemoryToken: string | null = null;

export async function getAccessToken() {
  if (inMemoryToken) {
    return inMemoryToken;
  }

  try {
    if (Platform.OS === 'web') {
      inMemoryToken = globalThis.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? null;
    } else {
      inMemoryToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }

    return inMemoryToken;
  } catch {
    return null;
  }
}

export async function setAccessToken(token: string) {
  inMemoryToken = token;

  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function clearAccessToken() {
  inMemoryToken = null;

  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export function getCachedAccessToken() {
  return inMemoryToken;
}
