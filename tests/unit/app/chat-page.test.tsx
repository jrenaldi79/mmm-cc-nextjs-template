import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// The AI SDK and react-markdown/remark-gfm ship ESM/TS that Jest won't
// transform from node_modules. Mock them so the test stays focused on the
// chat shell rendering (streaming behavior is covered by the route handler test).
jest.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    sendMessage: jest.fn(),
    status: 'ready',
    error: undefined,
  }),
}))
jest.mock('ai', () => ({
  TextStreamChatTransport: class {
    constructor() {}
  },
}))
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }))

import ChatPage from '@/app/chat/page'

describe('ChatPage', () => {
  beforeEach(() => {
    // useChat does not fetch on mount, but stub fetch to be safe.
    global.fetch = jest.fn(() => new Promise(() => {})) as unknown as typeof fetch
  })

  it('renders the chat shell', () => {
    render(<ChatPage />)

    expect(screen.getByText('🤖 LLM Agent Chat')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type a message…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    expect(
      screen.getByText(/ask anything to see a streamed response/i)
    ).toBeInTheDocument()
  })

  it('disables the send button while the input is empty', () => {
    render(<ChatPage />)
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })
})
