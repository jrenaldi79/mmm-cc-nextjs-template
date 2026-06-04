import type { N8nChatHistory } from '@/types/supabase';

/**
 * Map stored n8n LangChain history rows into the UI message shape used by the
 * chat pane. `n8n_chat_histories.message` is a LangChain BaseMessage
 * (`{ type: 'human' | 'ai' | 'system' | 'tool', content: string }`). We render
 * only the conversational turns: `human` → user bubble, `ai` → assistant bubble.
 * Rows are ordered by their serial `id` (chronological). Malformed or
 * content-less rows are skipped so a bad record can't break the transcript.
 */

export interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  parts: Array<{ type: 'text'; text: string }>;
}

const ROLE_BY_TYPE: Record<string, UiMessage['role']> = {
  human: 'user',
  ai: 'assistant',
};

export function historyToUiMessages(rows: N8nChatHistory[]): UiMessage[] {
  return [...rows]
    .sort((a, b) => a.id - b.id)
    .map(toUiMessage)
    .filter((m): m is UiMessage => m !== null);
}

function toUiMessage(row: N8nChatHistory): UiMessage | null {
  const message = row.message;
  if (!message || typeof message !== 'object' || Array.isArray(message)) {
    return null;
  }
  const { type, content } = message as { type?: unknown; content?: unknown };
  if (typeof type !== 'string' || typeof content !== 'string') return null;
  const role = ROLE_BY_TYPE[type];
  if (!role) return null;
  return {
    id: `history-${row.id}`,
    role,
    parts: [{ type: 'text', text: content }],
  };
}
