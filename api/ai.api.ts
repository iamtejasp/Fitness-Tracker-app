import { API_BASE_URL } from '@/constants/config';
import { getAccessToken } from '@/lib/authToken';
import { axiosInstance } from './axiosInstance';
import { CoachRequest, CoachResponse } from '@/types/api';

export async function getCoachAdvice(payload: CoachRequest): Promise<CoachResponse> {
  const { data } = await axiosInstance.post<CoachResponse>('/ai/coach', payload);

  return data;
}

export async function streamCoachAdvice(
  payload: CoachRequest,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/ai/coach/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AI stream failed with status ${response.status}`);
  }

  if (!response.body || !('getReader' in response.body)) {
    throw new Error('Streaming is not available on this platform');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const dataLine = event
        .split('\n')
        .find((line) => line.startsWith('data: '));

      if (!dataLine) {
        continue;
      }

      const payloadText = dataLine.replace('data: ', '').trim();

      if (payloadText === '[DONE]') {
        return;
      }

      const parsed = JSON.parse(payloadText) as { content?: string; message?: string };

      if (parsed.content) {
        onChunk(parsed.content);
      }
    }
  }
}
