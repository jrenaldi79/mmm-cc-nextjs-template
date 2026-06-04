/**
 * @jest-environment node
 */
import { GET } from '../../../../app/api/files/route'
import { NextRequest } from 'next/server'
import fs from 'fs/promises'

// Mock the fs module
jest.mock('fs/promises')

// Helper to create mock NextRequest
function createMockNextRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url),
  } as NextRequest
}

describe('GET /api/files', () => {
  const mockReaddir = fs.readdir as jest.MockedFunction<typeof fs.readdir>
  const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns markdown files from the project', async () => {
    // Mock file system responses
    mockReaddir
      .mockResolvedValueOnce([
        { name: 'README.md', isFile: () => true, isDirectory: () => false },
        { name: 'test.js', isFile: () => true, isDirectory: () => false },
        { name: 'docs', isFile: () => false, isDirectory: () => true },
        { name: 'node_modules', isFile: () => false, isDirectory: () => true },
      ] as any)
      .mockResolvedValueOnce([
        { name: 'guide.md', isFile: () => true, isDirectory: () => false },
      ] as any)

    const request = createMockNextRequest('http://localhost:3000/api/files')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    
    const hasReadme = data.some((item: any) => item.name === 'README.md' && item.type === 'file')
    const hasTestJs = data.some((item: any) => item.name === 'test.js')
    const hasDocsFolder = data.some((item: any) => item.name === 'docs' && item.type === 'folder')
    
    expect(hasReadme).toBe(true)
    expect(hasTestJs).toBe(false)
    expect(hasDocsFolder).toBe(true)
  })

  it('excludes specified directories', async () => {
    mockReaddir.mockResolvedValueOnce([
      { name: 'node_modules', isFile: () => false, isDirectory: () => true },
      { name: '.git', isFile: () => false, isDirectory: () => true },
      { name: '.next', isFile: () => false, isDirectory: () => true },
      { name: 'README.md', isFile: () => true, isDirectory: () => false },
    ] as any)

    const request = createMockNextRequest('http://localhost:3000/api/files')
    const response = await GET(request)
    const data = await response.json()

    expect(mockReaddir).toHaveBeenCalledTimes(1)
    const hasReadme = data.some((item: any) => item.name === 'README.md')
    expect(hasReadme).toBe(true)
  })

  it('handles errors gracefully', async () => {
    mockReaddir.mockRejectedValueOnce(new Error('File system error'))

    const request = createMockNextRequest('http://localhost:3000/api/files')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })

  it('returns content of allowed documentation file', async () => {
    const mockContent = '# Replit Documentation\n\nThis is test content.'
    mockReadFile.mockResolvedValueOnce(mockContent as any)

    const request = createMockNextRequest('http://localhost:3000/api/files?path=replit.md')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('content')
    expect(data.content).toBe(mockContent)
    expect(mockReadFile).toHaveBeenCalled()
  })

  it('returns content of SUPABASE_SETUP.md file', async () => {
    const mockContent = '# Supabase Setup\n\nSetup instructions.'
    mockReadFile.mockResolvedValueOnce(mockContent as any)

    const request = createMockNextRequest('http://localhost:3000/api/files?path=SUPABASE_SETUP.md')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('content')
    expect(data.content).toBe(mockContent)
  })

  it('rejects requests for non-allowed files', async () => {
    const request = createMockNextRequest('http://localhost:3000/api/files?path=package.json')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('not allowed')
  })

  it('handles file read errors gracefully', async () => {
    mockReadFile.mockRejectedValueOnce(new Error('File not found'))

    const request = createMockNextRequest('http://localhost:3000/api/files?path=replit.md')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
  })
})