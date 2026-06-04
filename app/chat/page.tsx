'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send } from 'lucide-react';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto w-full max-w-content px-6 py-12 md:px-9">
        <div className="mx-auto max-w-3xl">
          <Card className="flex h-[70vh] flex-col border-2 border-foreground rounded-2xl shadow-hard">
            <CardHeader>
              <CardTitle className="font-display">🤖 LLM Agent Chat</CardTitle>
              <CardDescription>
                Streams a response from{' '}
                <code className="bg-muted px-1 rounded">/api/chat</code>.
                Connect your n8n agent via{' '}
                <code className="bg-muted px-1 rounded">N8N_WEBHOOK_URL</code> —
                until then a placeholder reply streams back.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  Ask anything to see a streamed response.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[85%] text-left ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {message.parts
                            .map((p) => (p.type === 'text' ? p.text : ''))
                            .join('')}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {status === 'submitted' && (
                <p className="text-muted-foreground text-sm">Thinking…</p>
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
        </div>
      </div>
    </div>
  );
}
