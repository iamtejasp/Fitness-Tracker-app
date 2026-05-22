import { Platform } from 'react-native';

const localHost = Platform.select({
  android: '10.0.2.2',
  default: 'localhost',
});

export const API_BASE_URL = `http://${localHost}:3000/api/v1`;
