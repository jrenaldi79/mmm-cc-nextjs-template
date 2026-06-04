import type { ZepClient, Zep } from '@getzep/zep-cloud';
import type { User } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { toZepUser, displayName } from '@/lib/zep/identity';
import { N8N_RUN_SEPARATOR } from '@/lib/n8n-stream';

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

export interface ChatTurn {
  supabaseUser: User;
  threadId: string;
  userText: string;
  assistantText: string;
}

// user.add / thread.create reject if the entity already exists — expected on
// every turn after the first — so swallow their errors and continue.
async function ignoreErrors(fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch {
    /* already exists or transient — best-effort */
  }
}

// The inter-run separator is a UI-only marker; turn it into blank lines for the
// stored reply. Never contains the retrieved context (not passed to this fn).
function cleanAssistantText(text: string): string {
  return text.split(N8N_RUN_SEPARATOR).join('\n\n').trim();
}

/**
 * Record one chat turn to the user's Zep graph: ensure the user + thread exist,
 * then append the user message and assistant reply. Best-effort — never throws,
 * so a Zep failure can't affect the chat response.
 */
export async function recordChatTurn(
  client: ZepClient,
  turn: ChatTurn
): Promise<void> {
  const zepUser = toZepUser(turn.supabaseUser);
  try {
    await ignoreErrors(() => client.user.add({ ...zepUser }));
    await ignoreErrors(() =>
      client.thread.create({ threadId: turn.threadId, userId: zepUser.userId })
    );
    const messages: Zep.Message[] = [
      {
        role: 'user',
        name: displayName(turn.supabaseUser),
        content: turn.userText,
      },
      {
        role: 'assistant',
        name: 'Assistant',
        content: cleanAssistantText(turn.assistantText),
      },
    ];
    await client.thread.addMessages(turn.threadId, { messages });
  } catch (error) {
    logger.error('Zep recordChatTurn failed', { error: String(error) });
  }
}
