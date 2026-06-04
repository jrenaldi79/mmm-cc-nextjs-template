import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// The AI SDK and react-markdown/remark-gfm ship ESM/TS that Jest won't
// transform from node_modules. Mock them so the test stays focused on the
// chat shell rendering (streaming behavior is covered by the route handler test).
const mockSendMessage = jest.fn();
let mockChatState: {
  messages: Array<{
    id: string;
    role: string;
    parts: Array<{ type: string; text?: string }>;
  }>;
  status: string;
  error: unknown;
} = { messages: [], status: 'ready', error: undefined };

jest.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: mockChatState.messages,
    sendMessage: mockSendMessage,
    status: mockChatState.status,
    error: mockChatState.error,
  }),
}));
jest.mock('ai', () => ({
  TextStreamChatTransport: class {
    constructor() {}
  },
}));
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }));

// Navigation (rendered by this page) reads auth state from the Supabase
// browser client — stub it so it doesn't create a real client.
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  }),
}));

import ChatPage from '@/app/chat/page';

describe('ChatPage', () => {
  beforeEach(() => {
    mockSendMessage.mockReset();
    mockChatState = { messages: [], status: 'ready', error: undefined };
    global.fetch = jest.fn(
      () => new Promise(() => {})
    ) as unknown as typeof fetch;
  });

  it('renders the empty chat shell', () => {
    render(<ChatPage />);

    expect(screen.getByText('🤖 LLM Agent Chat')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a message…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(
      screen.getByText(/ask anything to see a streamed response/i)
    ).toBeInTheDocument();
  });

  it('disables the send button while the input is empty', () => {
    render(<ChatPage />);
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('renders user and assistant messages, the thinking indicator, and errors', () => {
    mockChatState = {
      messages: [
        { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hi there' }] },
        {
          id: '2',
          role: 'assistant',
          parts: [{ type: 'text', text: 'Hello!' }, { type: 'step-start' }],
        },
      ],
      status: 'submitted',
      error: new Error('boom'),
    };

    render(<ChatPage />);

    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Thinking…')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    // While busy the send button is disabled.
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('sends a message on submit', async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    await user.type(
      screen.getByPlaceholderText('Type a message…'),
      'Hello agent'
    );
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(mockSendMessage).toHaveBeenCalledWith({ text: 'Hello agent' });
  });
});
