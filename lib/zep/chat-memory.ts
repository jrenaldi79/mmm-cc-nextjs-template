import type { ZepClient } from '@getzep/zep-cloud';
import { logger } from '@/lib/logger';

const DEFAULT_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Zep request timed out')),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Fetch the user's long-term context block for a thread. Best-effort: on any
 * failure or timeout it returns '' so the chat proceeds without context.
 */
export async function retrieveUserContext(
  client: ZepClient,
  threadId: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<string> {
  try {
    const result = await withTimeout(
      client.thread.getUserContext(threadId),
      timeoutMs
    );
    return result?.context ?? '';
  } catch (error) {
    logger.warn('Zep getUserContext failed; proceeding without context', {
      error: String(error),
    });
    return '';
  }
}
