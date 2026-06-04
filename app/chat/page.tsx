'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PageHero } from '../components/PageHero';
import { PageShell } from '../components/PageShell';
import { ChatMessages } from '../components/chat/ChatMessages';

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
          <ChatMessages messages={messages} status={status} error={error} />
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
