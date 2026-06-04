import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import MarkdownPreviewPage from '../../app/markdown-preview/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null)
  }))
}))

// Mock mermaid
jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    run: jest.fn().mockResolvedValue(undefined),
  }
}))

// Mock fetch
global.fetch = jest.fn()

describe('MarkdownPreviewPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and displays markdown files on mount', async () => {
    const mockFiles = [
      { path: 'README.md', name: 'README.md', type: 'file' },
      { path: 'docs', name: 'docs', type: 'folder', children: [
        { path: 'docs/guide.md', name: 'guide.md', type: 'file' }
      ]}
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFiles
    })

    render(<MarkdownPreviewPage />)

    await waitFor(() => {
      expect(screen.getByText('README.md')).toBeInTheDocument()
      expect(screen.getByText('docs')).toBeInTheDocument()
    })
    
    const user = userEvent.setup()
    const docsFolder = screen.getByText('docs')
    await user.click(docsFolder)
    
    await waitFor(() => {
      expect(screen.getByText('guide.md')).toBeInTheDocument()
    })
  })

  it('displays error when file fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<MarkdownPreviewPage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch files')).toBeInTheDocument()
    })
  })

  it('loads and displays markdown content when file is clicked', async () => {
    const mockFiles = [
      { path: 'README.md', name: 'README.md', type: 'file' }
    ]
    const mockMarkdownResponse = {
      content: '# Test',
      html: '<h1>Test</h1>',
      file: 'README.md'
    }

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkdownResponse
      })

    render(<MarkdownPreviewPage />)

    await waitFor(() => {
      expect(screen.getByText('README.md')).toBeInTheDocument()
    })

    const fileItem = screen.getByText('README.md')
    const user = userEvent.setup()
    await user.click(fileItem)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Test' })).toBeInTheDocument()
    })
  })

  it('displays error when markdown load fails', async () => {
    const mockFiles = [
      { path: 'README.md', name: 'README.md', type: 'file' }
    ]

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'File not found' })
      })

    render(<MarkdownPreviewPage />)

    await waitFor(() => {
      expect(screen.getByText('README.md')).toBeInTheDocument()
    })

    const fileItem = screen.getByText('README.md')
    const user = userEvent.setup()
    await user.click(fileItem)

    await waitFor(() => {
      expect(screen.getByText('File not found')).toBeInTheDocument()
    })
  })

  it('preserves language-mermaid class for Mermaid diagram rendering', async () => {
    const mockFiles = [
      { path: 'diagram.md', name: 'diagram.md', type: 'file' }
    ]
    const mockMarkdownResponse = {
      content: '```mermaid\ngraph TD\nA-->B\n```',
      html: '<pre><code class="language-mermaid">graph TD\nA--&gt;B</code></pre>',
      file: 'diagram.md'
    }

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkdownResponse
      })

    const { container } = render(<MarkdownPreviewPage />)

    await waitFor(() => {
      expect(screen.getByText('diagram.md')).toBeInTheDocument()
    })

    const fileItem = screen.getByText('diagram.md')
    const user = userEvent.setup()
    await user.click(fileItem)

    await waitFor(() => {
      const codeBlock = container.querySelector('code.language-mermaid')
      expect(codeBlock).toBeInTheDocument()
      expect(codeBlock?.textContent).toContain('graph TD')
    })
  })
})