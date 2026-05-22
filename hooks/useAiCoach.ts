import { useState } from 'react';
import { getCoachAdvice, streamCoachAdvice } from '@/api/ai.api';
import { getApiErrorMessage } from '@/api/axiosInstance';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function useAiCoach(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();

    if (!trimmed || isStreaming) {
      return;
    }

    const assistantId = `assistant-${Date.now()}`;
    setError(null);
    setIsStreaming(true);
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', text: trimmed },
      { id: assistantId, role: 'assistant', text: '' },
    ]);

    let receivedChunk = false;

    try {
      await streamCoachAdvice({ message: trimmed }, (chunk) => {
        receivedChunk = true;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, text: `${message.text}${chunk}` }
              : message,
          ),
        );
      });
    } catch (streamError) {
      if (!receivedChunk) {
        try {
          const response = await getCoachAdvice({ message: trimmed });
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, text: response.advice }
                : message,
            ),
          );
          return;
        } catch (fallbackError) {
          const message = getApiErrorMessage(fallbackError);
          setError(message);
          setMessages((current) =>
            current.map((chatMessage) =>
              chatMessage.id === assistantId
                ? { ...chatMessage, text: message }
                : chatMessage,
            ),
          );
          return;
        }
      }

      const message = getApiErrorMessage(streamError);
      setError(message);
    } finally {
      setIsStreaming(false);
    }
  }

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
  };
}
