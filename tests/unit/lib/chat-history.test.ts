import { historyToUiMessages } from '@/lib/chat-history';
import type { N8nChatHistory } from '@/types/supabase';

function row(id: number, message: unknown): N8nChatHistory {
  return { id, session_id: 's1', message: message as never };
}

describe('historyToUiMessages', () => {
  it('maps human rows to user messages and ai rows to assistant messages', () => {
    const rows = [
      row(1, { type: 'human', content: 'Hello' }),
      row(2, { type: 'ai', content: 'Hi there' }),
    ];
    expect(historyToUiMessages(rows)).toEqual([
      {
        id: 'history-1',
        role: 'user',
        parts: [{ type: 'text', text: 'Hello' }],
      },
      {
        id: 'history-2',
        role: 'assistant',
        parts: [{ type: 'text', text: 'Hi there' }],
      },
    ]);
  });

  it('skips system and tool messages', () => {
    const rows = [
      row(1, { type: 'system', content: 'You are a bot' }),
      row(2, { type: 'tool', content: '{"result":1}' }),
      row(3, { type: 'human', content: 'Hi' }),
    ];
    const result = historyToUiMessages(rows);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('user');
  });

  it('preserves chronological order by row id', () => {
    const rows = [
      row(2, { type: 'ai', content: 'second' }),
      row(1, { type: 'human', content: 'first' }),
    ];
    const result = historyToUiMessages(rows);
    expect(result.map((m) => m.parts[0].text)).toEqual(['first', 'second']);
  });

  it('tolerates malformed or empty message payloads', () => {
    const rows = [
      row(1, null),
      row(2, 'not an object'),
      row(3, { type: 'human' }), // no content
      row(4, { type: 'ai', content: 'ok' }),
    ];
    const result = historyToUiMessages(rows);
    expect(result).toEqual([
      {
        id: 'history-4',
        role: 'assistant',
        parts: [{ type: 'text', text: 'ok' }],
      },
    ]);
  });

  it('returns an empty array for no rows', () => {
    expect(historyToUiMessages([])).toEqual([]);
  });
});
