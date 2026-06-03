import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoachAdvice, getCoachHistory, streamCoachAdvice } from '@/api/ai.api';
import { getApiErrorMessage } from '@/api/axiosInstance';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { CoachHistoryMessage } from '@/types/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'streaming' | 'complete' | 'error' | 'stopped';
  sourceText?: string;
}

export function useAiCoach() {
  const historyQuery = useQuery({
    queryKey: queryKeys.coachHistory(1, 50),
    queryFn: () => getCoachHistory(1, 50),
  });
  const historyMessages = useMemo(
    () => mapHistoryToChatMessages(historyQuery.data?.data ?? []),
    [historyQuery.data],
  );
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messages = useMemo(
    () => [...historyMessages, ...optimisticMessages],
    [historyMessages, optimisticMessages],
  );

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

    setOptimisticMessages((current) =>
      current.filter((message) => message.id !== assistantMessageId),
    );
    await createAssistantResponse(sourceText, false);
  }

  function stopStreaming() {
    abortControllerRef.current?.abort();
  }

  async function refreshHistory() {
    await queryClient.invalidateQueries({ queryKey: ['ai', 'coach-history'] });
    setOptimisticMessages([]);
  }

  async function createAssistantResponse(text: string, includeUserMessage: boolean) {
    const timestamp = Date.now();
    const clientMessageId = `coach-${timestamp}`;
    const assistantId = `assistant-${clientMessageId}`;
    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    setError(null);
    setIsStreaming(true);
    setOptimisticMessages((current) => [
      ...current,
      ...(includeUserMessage
        ? [{
            id: `user-${clientMessageId}`,
            role: 'user' as const,
            text,
            status: 'complete' as const,
          }]
        : []),
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
        { message: text, clientMessageId },
        (chunk) => {
          receivedChunk = true;
          setOptimisticMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, text: `${message.text}${chunk}` }
                : message,
            ),
          );
        },
        abortController.signal,
      );

      setOptimisticMessages((current) =>
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
      await refreshHistory();
    } catch (streamError) {
      if (abortController.signal.aborted) {
        setOptimisticMessages((current) =>
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
          const response = await getCoachAdvice({ message: text, clientMessageId });
          setOptimisticMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, status: 'complete', text: response.advice }
                : message,
            ),
          );
          await refreshHistory();
          return;
        } catch (fallbackError) {
          const message = getApiErrorMessage(fallbackError);
          setError(message);
          setOptimisticMessages((current) =>
            current.map((chatMessage) =>
              chatMessage.id === assistantId
                ? { ...chatMessage, status: 'error', text: getFriendlyAiError(message) }
                : chatMessage,
            ),
          );
          await refreshHistory();
          return;
        }
      }

      const message = getApiErrorMessage(streamError);
      setError(message);
      setOptimisticMessages((current) =>
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
      await refreshHistory();
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
      setIsStreaming(false);
    }
  }

  return {
    messages,
    isLoadingHistory: historyQuery.isLoading,
    isHistoryError: historyQuery.isError,
    isStreaming,
    error,
    sendMessage,
    retryMessage,
    refreshHistory,
    stopStreaming,
  };
}

function mapHistoryToChatMessages(history: CoachHistoryMessage[]): ChatMessage[] {
  const userTextByTurnId = new Map(
    history
      .filter((message) => message.role === 'user')
      .map((message) => [message.turnId, message.content]),
  );

  return history.map((message) => ({
    id: message.id,
    role: message.role,
    text: message.content,
    status: message.status,
    sourceText:
      message.role === 'assistant'
        ? userTextByTurnId.get(message.turnId)
        : undefined,
  }));
}

function getFriendlyAiError(message: string) {
  if (message.includes('502') || message.toLowerCase().includes('unavailable')) {
    return 'AI coaching is unavailable right now. Try again in a moment.';
  }

  return message || 'AI coaching is unavailable right now. Try again in a moment.';
}
