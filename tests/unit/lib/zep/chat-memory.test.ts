/** @jest-environment node */
import type { ZepClient } from '@getzep/zep-cloud';
import type { User } from '@supabase/supabase-js';
import { retrieveUserContext, recordChatTurn } from '@/lib/zep/chat-memory';
import { N8N_RUN_SEPARATOR } from '@/lib/n8n-stream';

function fakeClient(getUserContext: jest.Mock): ZepClient {
  return {
    thread: { getUserContext, create: jest.fn(), addMessages: jest.fn() },
    user: { add: jest.fn() },
  } as unknown as ZepClient;
}

describe('retrieveUserContext', () => {
  it('returns the context string from getUserContext', async () => {
    const client = fakeClient(
      jest.fn().mockResolvedValue({ context: 'USER SUMMARY + FACTS' })
    );
    await expect(retrieveUserContext(client, 'thread-1')).resolves.toBe(
      'USER SUMMARY + FACTS'
    );
  });

  it('returns empty string when getUserContext throws', async () => {
    const client = fakeClient(jest.fn().mockRejectedValue(new Error('boom')));
    await expect(retrieveUserContext(client, 'thread-1')).resolves.toBe('');
  });

  it('returns empty string when getUserContext exceeds the timeout', async () => {
    const client = fakeClient(jest.fn().mockReturnValue(new Promise(() => {}))); // never resolves
    await expect(retrieveUserContext(client, 'thread-1', 20)).resolves.toBe('');
  });

  it('returns empty string when getUserContext resolves without a context field', async () => {
    const client = fakeClient(jest.fn().mockResolvedValue({}));
    await expect(retrieveUserContext(client, 'thread-1')).resolves.toBe('');
  });
});

function fakeWriteClient() {
  const add = jest.fn().mockResolvedValue(undefined);
  const create = jest.fn().mockResolvedValue(undefined);
  const addMessages = jest.fn().mockResolvedValue(undefined);
  const client = {
    user: { add },
    thread: { create, addMessages, getUserContext: jest.fn() },
  } as unknown as ZepClient;
  return { client, add, create, addMessages };
}

const supabaseUser = {
  id: 'user-123',
  email: 'jane@example.com',
  user_metadata: {},
} as User;

describe('recordChatTurn', () => {
  it('adds the user, creates the thread, and writes both messages in order', async () => {
    const { client, add, create, addMessages } = fakeWriteClient();
    await recordChatTurn(client, {
      supabaseUser,
      threadId: 'thread-1',
      userText: 'hello',
      assistantText: 'hi there',
    });
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-123' })
    );
    expect(create).toHaveBeenCalledWith({
      threadId: 'thread-1',
      userId: 'user-123',
    });
    const [threadId, payload] = addMessages.mock.calls[0];
    expect(threadId).toBe('thread-1');
    expect(payload.messages).toEqual([
      expect.objectContaining({ role: 'user', content: 'hello' }),
      expect.objectContaining({ role: 'assistant', content: 'hi there' }),
    ]);
  });

  it('does NOT include any retrieved context — only the raw turn text (no feedback loop)', async () => {
    const { client, addMessages } = fakeWriteClient();
    await recordChatTurn(client, {
      supabaseUser,
      threadId: 'thread-1',
      userText: 'what is my plan?',
      assistantText: 'Your plan is Pro.',
    });
    const payload = addMessages.mock.calls[0][1];
    const contents = payload.messages.map(
      (m: { content: string }) => m.content
    );
    expect(contents).toEqual(['what is my plan?', 'Your plan is Pro.']);
  });

  it('joins multi-run separators in the assistant text into blank lines', async () => {
    const { client, addMessages } = fakeWriteClient();
    await recordChatTurn(client, {
      supabaseUser,
      threadId: 'thread-1',
      userText: 'q',
      assistantText: `let me check${N8N_RUN_SEPARATOR}the answer is 42`,
    });
    const payload = addMessages.mock.calls[0][1];
    expect(payload.messages[1].content).toBe(
      'let me check\n\nthe answer is 42'
    );
  });

  it('swallows "already exists" errors from user.add / thread.create and still writes messages', async () => {
    const { client, add, create, addMessages } = fakeWriteClient();
    add.mockRejectedValueOnce(new Error('user already exists'));
    create.mockRejectedValueOnce(new Error('thread already exists'));
    await recordChatTurn(client, {
      supabaseUser,
      threadId: 'thread-1',
      userText: 'hi',
      assistantText: 'yo',
    });
    expect(addMessages).toHaveBeenCalledTimes(1);
  });

  it('never throws when addMessages fails', async () => {
    const { client, addMessages } = fakeWriteClient();
    addMessages.mockRejectedValue(new Error('zep down'));
    await expect(
      recordChatTurn(client, {
        supabaseUser,
        threadId: 't',
        userText: 'a',
        assistantText: 'b',
      })
    ).resolves.toBeUndefined();
  });
});
