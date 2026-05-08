import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  style?: ViewStyle;
}

export function Screen({ children, scroll = true, style }: ScreenProps) {
  if (!scroll) {
    return <SafeAreaView style={[styles.safe, style]}>{children}</SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 110,
  },
});
