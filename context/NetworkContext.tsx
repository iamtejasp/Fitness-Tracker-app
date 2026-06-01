import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

interface NetworkContextValue {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export function NetworkProvider({ children }: PropsWithChildren) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const nextIsOnline = Boolean(state.isConnected && state.isInternetReachable !== false);

      setIsOnline(nextIsOnline);
      onlineManager.setOnline(nextIsOnline);
    });
  }, []);

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }

  return context;
}

export function OfflineBanner() {
  const { isOnline } = useNetwork();

  if (isOnline) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.banner}>
      <Text accessibilityRole="alert" style={styles.text}>You are offline. Cached data may be out of date.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.amber,
  },
  text: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
});
