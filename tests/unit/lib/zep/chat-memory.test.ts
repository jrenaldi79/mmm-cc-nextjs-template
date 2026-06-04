/** @jest-environment node */
import type { ZepClient } from '@getzep/zep-cloud';
import { retrieveUserContext } from '@/lib/zep/chat-memory';

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
});
