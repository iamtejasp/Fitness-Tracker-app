import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors, radii } from '@/constants/theme';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  text: string;
  status?: 'streaming' | 'complete' | 'error' | 'stopped';
  onCopy?: () => void;
  onRetry?: () => void;
}

export function ChatBubble({ role, text, status, onCopy, onRetry }: ChatBubbleProps) {
  const isUser = role === 'user';
  const isAssistant = !isUser;

  return (
    <View style={[styles.row, isUser && styles.userRow]}>
      {isAssistant ? (
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
        </View>
      ) : null}
      <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
        {isAssistant ? <Text style={styles.sender}>Coach</Text> : null}
        <Text style={[styles.text, isUser && styles.userText]}>
          {text || (status === 'streaming' ? 'Thinking through your training history...' : '')}
        </Text>
        {isAssistant && status === 'streaming' ? (
          <View style={styles.statusRow}>
            <View style={styles.liveDot} />
            <Text style={styles.statusText}>Streaming advice</Text>
          </View>
        ) : null}
        {isAssistant && status === 'stopped' ? (
          <Text style={styles.statusText}>Stopped</Text>
        ) : null}
        {isAssistant && (onCopy || onRetry) ? (
          <View style={styles.actions}>
            {onCopy && text ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Copy coach message" onPress={onCopy} style={styles.iconAction}>
                <Ionicons name="copy-outline" size={15} color={colors.text} />
                <Text style={styles.iconActionText}>Copy</Text>
              </Pressable>
            ) : null}
            {onRetry ? <Button title="Retry" variant="secondary" onPress={onRetry} style={styles.actionButton} /> : null}
          </View>
        ) : null}
      </View>
      {isUser ? (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={15} color={colors.background} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 9,
    marginBottom: 14,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: 'rgba(124, 255, 107, 0.14)',
    borderColor: 'rgba(124, 255, 107, 0.22)',
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  userAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  bubble: {
    borderRadius: radii.lg,
    maxWidth: '80%',
    padding: 14,
  },
  assistant: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
  },
  user: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 7,
  },
  sender: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 5,
    textTransform: 'uppercase',
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
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  liveDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 7,
    width: 7,
  },
  statusText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  iconAction: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
  },
  iconActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  actionButton: {
    minHeight: 38,
    paddingHorizontal: 12,
  },
});
