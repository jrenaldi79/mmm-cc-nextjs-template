import { createTextStreamResponse, simulateReadableStream } from 'ai';
import { z } from 'zod';

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
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  // ---- Real n8n agent: proxy the workflow and stream its response back ----
  if (webhookUrl) {
    let upstream: Response;
    try {
      upstream = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.N8N_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}` }
            : {}),
        },
        body: JSON.stringify({
          message: userText,
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

    // n8n is assumed to stream raw text tokens. If your workflow emits SSE or
    // NDJSON instead, transform `upstream.body` into a text stream here before
    // passing it on.
    const textStream = upstream.body.pipeThrough(new TextDecoderStream());
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
