import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastPayload {
  message: string;
  type?: ToastType;
}

interface ToastState extends ToastPayload {
  id: number;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (payload: ToastPayload) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((payload: ToastPayload) => {
    setToast({
      id: Date.now(),
      message: payload.message,
      type: payload.type ?? 'info',
    });
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = setTimeout(hideToast, 2800);

    return () => clearTimeout(timeout);
  }, [hideToast, toast]);

  const value = useMemo(() => ({ showToast, hideToast }), [hideToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          style={[styles.toast, styles[toast.type]]}>
          <Text style={styles.text}>{toast.message}</Text>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  toast: {
    borderRadius: radii.md,
    bottom: 28,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 13,
    position: 'absolute',
    right: 20,
    zIndex: 1000,
  },
  success: {
    backgroundColor: colors.primary,
  },
  error: {
    backgroundColor: colors.danger,
  },
  info: {
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderWidth: 1,
  },
  text: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
});
