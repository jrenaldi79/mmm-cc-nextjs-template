# Integration: n8n LLM Agent Streaming

This template ships a working scaffold that calls an **n8n** workflow over an
HTTP webhook and **streams an LLM agent's response back to the UI**
token-by-token. Files: `app/api/chat/route.ts` (server) and `app/chat/page.tsx`
(client chat UI).

- **Architecture**: Chat UI (`useChat`) → Next.js Route Handler
  (`app/api/chat/route.ts`) → n8n Webhook (AI Agent node with streaming) →
  response streamed back through the route handler to the browser. **Always
  proxy through the route handler** — the n8n webhook URL/secret stay
  server-side (`N8N_WEBHOOK_URL` / `N8N_WEBHOOK_SECRET`); never call n8n from
  the browser.
- **Placeholder mode**: When `N8N_WEBHOOK_URL` is unset, the route streams a
  mock reply (via `simulateReadableStream`) so the UI works before n8n is
  connected. Set the env var to switch to the real agent.
- **Streaming transport**: The **Web Streams API** (built into Next.js /
  Node 20+ and the browser). The route forwards the upstream `ReadableStream`
  as a plain text stream via `createTextStreamResponse`; the client consumes
  it with the AI SDK's `TextStreamChatTransport`.
- **Installed dependencies**:
  - `ai` + `@ai-sdk/react` — `useChat` hook + streaming helpers.
  - `zod` — request-body validation.
  - `react-markdown` + `remark-gfm` — render streamed assistant markdown
    safely (no `dangerouslySetInnerHTML`).
- **n8n config**: Enable streaming on the AI Agent / "Respond to Webhook"
  node. Its chunk format isn't standardized, so **normalize n8n's chunks into
  a plain text stream inside the route handler** (the scaffold assumes raw
  text tokens; adapt the `pipeThrough` if your workflow emits SSE/NDJSON).
- **Env**: `N8N_WEBHOOK_URL` (and optional `N8N_WEBHOOK_SECRET`) live in
  `.env.local`; placeholders are in `.env.example`.
