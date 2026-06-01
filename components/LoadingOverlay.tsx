import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.backdrop}>
        <View accessibilityRole="progressbar" style={styles.card}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(8, 11, 16, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 14,
    padding: 24,
    width: '100%',
  },
  message: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
});
