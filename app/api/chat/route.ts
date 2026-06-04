import { createTextStreamResponse, simulateReadableStream } from 'ai';
import { z } from 'zod';
import { createN8nTextStream } from '@/lib/n8n-stream';

// Allow streaming responses up to 30 seconds.
export const maxDuration = 30;

// We only need role + text parts; Zod strips any extra fields the AI SDK sends.
const uiMessageSchema = z.object({
  role: z.string(),
  parts: z
    .array(z.object({ type: z.string(), text: z.string().optional() }))
    .optional(),
});

const chatRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1),
  // Stable per-conversation id so the n8n AI Agent can keep memory across turns.
  // The client sends one; if absent we generate a fallback.
  sessionId: z.string().optional(),
});

type UiMessage = z.infer<typeof uiMessageSchema>;

function latestUserText(messages: UiMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser?.parts) return '';
  return lastUser.parts
    .map((p) => (p.type === 'text' && p.text ? p.text : ''))
    .join(' ')
    .trim();
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Streams an LLM agent response back to the UI.
 *
 * - If `N8N_WEBHOOK_URL` is set, this proxies the request to your n8n workflow
 *   and streams its response straight through. (The webhook URL/secret stay
 *   server-side and are never exposed to the browser.)
 * - Otherwise it streams a placeholder response so the chat UI works out of the
 *   box before n8n is connected.
 *
 * The response is a plain text stream consumed on the client by the AI SDK's
 * `TextStreamChatTransport` (see `app/chat/page.tsx`).
 */
export async function POST(request: Request): Promise<Response> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return jsonError('Invalid request body: expected { messages: [...] }', 400);
  }

  const userText = latestUserText(parsed.data.messages);
  const sessionId = parsed.data.sessionId ?? crypto.randomUUID();
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  // ---- Real n8n agent: proxy the workflow and stream its response back ----
  if (webhookUrl) {
    let upstream: Response;
    try {
      upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // n8n "Header Auth" credential — students configure a header named
          // API_KEY; its value is the server-side secret (never sent to the browser).
          ...(process.env.N8N_WEBHOOK_SECRET
            ? { API_KEY: process.env.N8N_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify({
          message: userText,
          sessionId,
          messages: parsed.data.messages,
        }),
      });
    } catch {
      return jsonError('Could not reach the n8n webhook', 502);
    }

    if (!upstream.ok || !upstream.body) {
      return jsonError(
        `n8n webhook returned an error (${upstream.status})`,
        502
      );
    }

    // n8n's AI Agent streams newline-delimited JSON envelopes; extract just the
    // reply text. Plain-text workflows pass through unchanged (see lib/n8n-stream).
    const textStream = upstream.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(createN8nTextStream());
    return createTextStreamResponse({ textStream });
  }

  // ---- Placeholder: stream a mock reply so the UI works before n8n ----
  const reply =
    `👋 **Placeholder response** from \`/api/chat\`.\n\n` +
    (userText ? `You said: _"${userText}"_\n\n` : '') +
    `To stream a real LLM agent, set \`N8N_WEBHOOK_URL\` in your \`.env.local\` ` +
    `to your n8n webhook. This route will then proxy and stream its response ` +
    `here token-by-token.`;

  const chunks = reply.match(/\S+\s*/g) ?? [reply];
  const textStream = simulateReadableStream({
    chunks,
    initialDelayInMs: 150,
    chunkDelayInMs: 35,
  });

  return createTextStreamResponse({ textStream });
}
