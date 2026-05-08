import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/constants/theme';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  text: string;
}

export function ChatBubble({ role, text }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
      <Text style={[styles.text, isUser && styles.userText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: radii.lg,
    marginBottom: 12,
    maxWidth: '86%',
    padding: 14,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  userText: {
    color: colors.background,
    fontWeight: '700',
  },
});
