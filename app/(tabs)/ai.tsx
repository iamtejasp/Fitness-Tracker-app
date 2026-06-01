import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ChatBubble } from '@/components/ChatBubble';
import { colors, radii, typography } from '@/constants/theme';
import { useToast } from '@/context/ToastContext';
import { useAiCoach } from '@/hooks/useAiCoach';

const prompts = [
  'How can I improve my bench press?',
  'Plan my next leg day.',
  'Am I overtraining this week?',
];

interface CoachFormValues {
  message: string;
}

const coachSchema: yup.ObjectSchema<CoachFormValues> = yup.object({
  message: yup.string().trim().min(3, 'Message must be at least 3 characters.').max(1000, 'Message is too long.').required('Message is required.'),
});

export default function AiCoachScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { showToast } = useToast();
  const { control, handleSubmit, reset, setValue } = useForm<CoachFormValues>({
    resolver: yupResolver(coachSchema),
    defaultValues: {
      message: '',
    },
  });
  const coach = useAiCoach();

  useEffect(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, [coach.messages]);

  async function sendMessage(message: string) {
    await Haptics.selectionAsync();
    coach.sendMessage(message);
    reset({ message: '' });
  }

  async function copyMessage(text: string) {
    await Clipboard.setStringAsync(text);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast({ message: 'Copied coach response.', type: 'success' });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', default: undefined })}
        keyboardVerticalOffset={88}
        style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <View style={styles.kickerRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.kicker}>Workout-aware AI</Text>
            </View>
            <Text style={styles.title}>AI Coach</Text>
            <Text style={styles.subtitle}>Ask for concise advice grounded in your last 30 days.</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.prompts}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            style={styles.promptScroller}>
          {prompts.map((prompt) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Use prompt: ${prompt}`}
              disabled={coach.isStreaming}
              key={prompt}
              onPress={async () => {
                await Haptics.selectionAsync();
                setValue('message', prompt);
                coach.sendMessage(prompt);
                reset({ message: '' });
              }}
              style={({ pressed }) => [styles.prompt, pressed && styles.promptPressed, coach.isStreaming && styles.promptDisabled]}>
              <Text numberOfLines={1} style={styles.promptText}>{prompt}</Text>
            </Pressable>
          ))}
          </ScrollView>

          {coach.messages.length ? (
            <View style={styles.messages}>
              {coach.messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  text={message.text}
                  status={message.status}
                  onCopy={message.role === 'assistant' && message.text ? () => copyMessage(message.text) : undefined}
                  onRetry={
                    message.role === 'assistant' && message.status === 'error'
                      ? async () => {
                          await Haptics.selectionAsync();
                          coach.retryMessage(message.id);
                        }
                      : undefined
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyCoachCard}>
              <View style={styles.emptyIcon}>
                <Ionicons name="sparkles" size={30} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Ready for your next set</Text>
              <Text style={styles.emptyText}>
                I will read your recent workout history, spot plateaus, and suggest a practical next step.
              </Text>
              <View style={styles.contextRow}>
                <View style={styles.contextPill}>
                  <Ionicons name="barbell-outline" size={14} color={colors.primary} />
                  <Text style={styles.contextText}>30-day history</Text>
                </View>
                <View style={styles.contextPill}>
                  <Ionicons name="trending-up-outline" size={14} color={colors.coral} />
                  <Text style={styles.contextText}>Plateau checks</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {coach.error ? (
          <View accessibilityRole="alert" style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={15} color={colors.danger} />
            <Text style={styles.error}>{coach.error}</Text>
          </View>
        ) : null}

        <View style={styles.composerShell}>
          <Controller
            control={control}
            name="message"
            render={({ field: { onChange, value }, fieldState }) => (
              <View style={styles.inputWrap}>
                <View style={[styles.composer, fieldState.error && styles.inputError]}>
                  <TextInput
                    accessibilityLabel="Ask your AI coach"
                    multiline
                    placeholder="Ask about your next workout..."
                    placeholderTextColor={colors.subtle}
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    editable={!coach.isStreaming}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={coach.isStreaming ? 'Stop AI response' : 'Send message to AI coach'}
                    onPress={
                      coach.isStreaming
                        ? async () => {
                            await Haptics.selectionAsync();
                            coach.stopStreaming();
                          }
                        : handleSubmit((values) => sendMessage(values.message))
                    }
                    style={({ pressed }) => [
                      styles.sendControl,
                      coach.isStreaming && styles.stopControl,
                      pressed && styles.sendControlPressed,
                    ]}>
                    <Ionicons
                      name={coach.isStreaming ? 'stop' : 'send'}
                      size={18}
                      color={coach.isStreaming ? colors.text : colors.background}
                    />
                  </Pressable>
                </View>
                {fieldState.error ? <Text style={styles.fieldError}>{fieldState.error.message}</Text> : null}
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
  },
  headerCopy: { flex: 1, minWidth: 0 },
  kickerRow: { alignItems: 'center', flexDirection: 'row', gap: 7, marginBottom: 6 },
  onlineDot: { backgroundColor: colors.primary, borderRadius: 999, height: 8, width: 8 },
  kicker: { color: colors.primary, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(124, 255, 107, 0.13)',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  title: { color: colors.text, ...typography.screenTitle, fontSize: 30 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 5 },
  chatContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  promptScroller: {
    flexGrow: 0,
    marginBottom: 16,
    maxHeight: 40,
  },
  prompts: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  prompt: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    maxWidth: 240,
    minHeight: 36,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  promptPressed: { opacity: 0.8 },
  promptDisabled: { opacity: 0.5 },
  promptText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  messages: { paddingTop: 2 },
  emptyCoachCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    marginTop: 8,
    padding: 22,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(124, 255, 107, 0.14)',
    borderRadius: 999,
    height: 70,
    justifyContent: 'center',
    marginBottom: 14,
    width: 70,
  },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  emptyText: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  contextRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 },
  contextPill: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  contextText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  errorBanner: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 92, 122, 0.10)',
    borderColor: 'rgba(255, 92, 122, 0.28)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  error: { color: colors.danger, flex: 1, fontSize: 12, fontWeight: '800', lineHeight: 17 },
  composerShell: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 74,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputWrap: {
    gap: 6,
  },
  composer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 50,
    paddingLeft: 14,
    paddingRight: 7,
    paddingVertical: 6,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    maxHeight: 92,
    minHeight: 34,
    paddingBottom: 7,
    paddingTop: 7,
  },
  inputError: {
    borderColor: colors.danger,
  },
  fieldError: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: 4,
  },
  sendControl: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  stopControl: {
    backgroundColor: 'rgba(255, 92, 122, 0.18)',
    borderColor: colors.danger,
    borderWidth: 1,
  },
  sendControlPressed: {
    opacity: 0.82,
  },
});
