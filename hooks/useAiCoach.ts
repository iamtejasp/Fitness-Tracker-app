import { useRef, useState } from 'react';
import { getCoachAdvice, streamCoachAdvice } from '@/api/ai.api';
import { getApiErrorMessage } from '@/api/axiosInstance';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'streaming' | 'complete' | 'error' | 'stopped';
  sourceText?: string;
}

export function useAiCoach(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();

    if (!trimmed || isStreaming) {
      return;
    }

    await createAssistantResponse(trimmed, true);
  }

  async function retryMessage(assistantMessageId: string) {
    const failedMessage = messages.find((message) => message.id === assistantMessageId);
    const sourceText = failedMessage?.sourceText?.trim();

    if (!sourceText || isStreaming) {
      return;
    }

    setMessages((current) => current.filter((message) => message.id !== assistantMessageId));
    await createAssistantResponse(sourceText, false);
  }

  function stopStreaming() {
    abortControllerRef.current?.abort();
  }

  async function createAssistantResponse(text: string, includeUserMessage: boolean) {
    const timestamp = Date.now();
    const assistantId = `assistant-${timestamp}`;
    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    setError(null);
    setIsStreaming(true);
    setMessages((current) => [
      ...current,
      ...(includeUserMessage ? [{ id: `user-${timestamp}`, role: 'user' as const, text }] : []),
      {
        id: assistantId,
        role: 'assistant' as const,
        text: '',
        status: 'streaming' as const,
        sourceText: text,
      },
    ]);

    let receivedChunk = false;

    try {
      await streamCoachAdvice(
        { message: text },
        (chunk) => {
          receivedChunk = true;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, text: `${message.text}${chunk}` }
                : message,
            ),
          );
        },
        abortController.signal,
      );

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                status: 'complete',
                text: message.text || 'I could not generate coaching advice right now.',
              }
            : message,
        ),
      );
    } catch (streamError) {
      if (abortController.signal.aborted) {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  status: 'stopped',
                  text: message.text || 'Response stopped.',
                }
              : message,
          ),
        );
        return;
      }

      if (!receivedChunk) {
        try {
          const response = await getCoachAdvice({ message: text });
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, status: 'complete', text: response.advice }
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
                ? { ...chatMessage, status: 'error', text: getFriendlyAiError(message) }
                : chatMessage,
            ),
          );
          return;
        }
      }

      const message = getApiErrorMessage(streamError);
      setError(message);
      setMessages((current) =>
        current.map((chatMessage) =>
          chatMessage.id === assistantId
            ? {
                ...chatMessage,
                status: 'error',
                text: `${chatMessage.text}\n\n${getFriendlyAiError(message)}`.trim(),
              }
            : chatMessage,
        ),
      );
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
      setIsStreaming(false);
    }
  }

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    retryMessage,
    stopStreaming,
  };
}

function getFriendlyAiError(message: string) {
  if (message.includes('502') || message.toLowerCase().includes('unavailable')) {
    return 'AI coaching is unavailable right now. Try again in a moment.';
  }

  return message || 'AI coaching is unavailable right now. Try again in a moment.';
}
