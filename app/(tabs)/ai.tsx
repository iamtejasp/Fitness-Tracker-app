import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ChatBubble } from '@/components/ChatBubble';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { colors } from '@/constants/theme';
import { chatMessages } from '@/data/mockData';

const prompts = ['Improve bench press', 'Plan my next leg day', 'Am I overtraining?'];

export default function AiCoachScreen() {
  return (
    <Screen>
      <Text style={styles.title}>AI Coach</Text>
      <Text style={styles.subtitle}>Concise coaching based on your workout history.</Text>
      <View style={styles.prompts}>
        {prompts.map((prompt) => <Text key={prompt} style={styles.prompt}>{prompt}</Text>)}
      </View>
      <View style={styles.chat}>
        {chatMessages.length ? chatMessages.map((message) => (
          <ChatBubble key={message.id} role={message.role} text={message.text} />
        )) : (
          <EmptyState title="Ask your AI coach" message="Get personalized guidance from your recent training data." icon="sparkles-outline" />
        )}
        <View style={styles.typing}>
          <Ionicons name="radio-button-on" size={10} color={colors.primary} />
          <Text style={styles.typingText}>Streaming response preview</Text>
        </View>
      </View>
      <TextField label="Message" placeholder="How can I improve my bench press?" />
      <Button title="Send message" icon={<Ionicons name="send" size={17} color={colors.background} />} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: 0 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 16, marginTop: 6 },
  prompts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  prompt: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 999, borderWidth: 1, color: colors.text, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 8 },
  chat: { marginBottom: 12 },
  typing: { alignItems: 'center', flexDirection: 'row', gap: 8, marginBottom: 18, marginLeft: 8 },
  typingText: { color: colors.muted, fontSize: 12 },
});
