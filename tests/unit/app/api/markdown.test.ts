/**
 * @jest-environment node
 */
import { GET } from '../../../../app/api/markdown/route'
import { NextRequest } from 'next/server'
import fs from 'fs/promises'

// Mock modules
jest.mock('fs/promises')
jest.mock('marked', () => ({
  marked: jest.fn().mockImplementation((content: string) => Promise.resolve(`<p>${content}</p>`))
}))
jest.mock('isomorphic-dompurify', () => ({
  sanitize: jest.fn().mockImplementation((html: string) => html)
}))

describe('GET /api/markdown', () => {
  const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns markdown content and HTML for valid file', async () => {
    const mockContent = '# Test Markdown\n\nThis is a test.'
    mockReadFile.mockResolvedValueOnce(mockContent)

    const request = new NextRequest('http://localhost:5000/api/markdown?file=README.md')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.content).toBe(mockContent)
    expect(data.html).toContain('<p>')
    expect(data.file).toBe('README.md')
  })

  it('returns 400 when file parameter is missing', async () => {
    const request = new NextRequest('http://localhost:5000/api/markdown')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('File parameter is required')
  })

  it('returns 403 for path traversal attempts', async () => {
    const request = new NextRequest('http://localhost:5000/api/markdown?file=../../../etc/passwd')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Access denied: path outside project root')
  })

  it('returns 403 for non-markdown files', async () => {
    const request = new NextRequest('http://localhost:5000/api/markdown?file=config.json')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Only markdown files are allowed')
  })

  it('returns 404 when file does not exist', async () => {
    mockReadFile.mockRejectedValueOnce({ code: 'ENOENT' } as any)

    const request = new NextRequest('http://localhost:5000/api/markdown?file=nonexistent.md')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('File not found')
  })

  it('returns 500 for other file system errors', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('Permission denied'))

    const request = new NextRequest('http://localhost:5000/api/markdown?file=test.md')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to read file')
  })
})