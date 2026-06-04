'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PageHero } from '../components/PageHero';
import { PageShell } from '../components/PageShell';
import { N8N_RUN_SEPARATOR } from '@/lib/n8n-stream';

export default function ChatPage() {
  // Stable id for this chat session so the n8n agent can keep memory across turns.
  const [sessionId] = useState(() => crypto.randomUUID());
  // Created once; consumes the plain text stream from /api/chat.
  const [transport] = useState(
    () => new TextStreamChatTransport({ api: '/api/chat', body: { sessionId } })
  );
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState('');

  const isBusy = status === 'submitted' || status === 'streaming';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput('');
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="AI Chat"
        title={
          <>
            LLM Agent{' '}
            <span className="font-serif font-normal italic text-primary">
              Chat
            </span>
          </>
        }
        subtitle={
          <>
            Streams a response from{' '}
            <code className="rounded bg-muted px-1">/api/chat</code>. Connect
            your n8n agent via{' '}
            <code className="rounded bg-muted px-1">N8N_WEBHOOK_URL</code> —
            until then a placeholder reply streams back.
          </>
        }
      />
      <Card className="flex h-[70vh] flex-col border-2 border-foreground rounded-2xl shadow-hard">
        <CardContent className="flex-1 overflow-y-auto space-y-4 pt-6">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              Ask anything to see a streamed response.
            </p>
          ) : (
            messages.map((message) => {
              const isUser = message.role === 'user';
              const text = message.parts
                .map((p) => (p.type === 'text' ? p.text : ''))
                .join('');
              // An agent may answer in several runs (e.g. an interim "let me
              // check our docs" reply, then the final answer). The route marks
              // run boundaries with N8N_RUN_SEPARATOR; show one bubble per run.
              const runs = text
                .split(N8N_RUN_SEPARATOR)
                .filter((run) => run.trim() !== '');
              const segments = runs.length > 0 ? runs : [''];
              return (
                <div key={message.id} className="space-y-2">
                  {segments.map((segment, i) => (
                    <div
                      key={`${message.id}-${i}`}
                      className={isUser ? 'text-right' : 'text-left'}
                    >
                      <div
                        className={`inline-block rounded-lg px-4 py-2 max-w-[85%] text-left ${
                          isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div
                          className={`prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2 ${
                            isUser ? 'prose-invert' : ''
                          }`}
                        >
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {segment}
                          </Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}

          {status === 'submitted' && (
            <div
              role="status"
              aria-label="Thinking"
              className="flex items-center gap-1 px-1"
            >
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: '-0.3s' }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: '-0.15s' }}
              />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              <span className="sr-only">Thinking…</span>
            </div>
          )}
          {error && (
            <p className="text-destructive text-sm">
              Something went wrong. Please try again.
            </p>
          )}
        </CardContent>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              disabled={isBusy}
              aria-label="Message"
            />
            <Button type="submit" disabled={isBusy || !input.trim()}>
              <Send />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </PageShell>
  );
}
