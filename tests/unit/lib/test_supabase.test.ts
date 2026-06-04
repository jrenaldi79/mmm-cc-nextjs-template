/**
 * @jest-environment node
 */

// Mock @supabase/supabase-js before any imports
const mockCreateClient = jest.fn(() => ({
  from: jest.fn(),
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}))

describe('Supabase Client Configuration', () => {
  beforeAll(() => {
    // Set environment variables before importing
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('should call createClient with correct environment variables', () => {
    // Import after mock is set up
    const { supabase } = require('@/lib/supabase')

    // Verify createClient was called with the correct parameters
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )

    // Verify the exported client is defined and functional
    expect(supabase).toBeDefined()
    expect(supabase.from).toBeDefined()
  })
})

describe('Supabase Client Configuration - Error Handling', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
    jest.resetModules()
  })

  it('should throw error when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    jest.isolateModules(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = ''
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

      expect(() => {
        require('@/lib/supabase')
      }).toThrow('Missing Supabase environment variables')
    })
  })

  it('should throw error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    jest.isolateModules(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ''

      expect(() => {
        require('@/lib/supabase')
      }).toThrow('Missing Supabase environment variables')
    })
  })

  it('should throw error when both environment variables are missing', () => {
    jest.isolateModules(() => {
      const envBackup = { ...process.env }
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      expect(() => {
        require('@/lib/supabase')
      }).toThrow('Missing Supabase environment variables')

      process.env = envBackup
    })
  })

  it('should include helpful error message about Replit Secrets', () => {
    jest.isolateModules(() => {
      const envBackup = { ...process.env }
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      expect(() => {
        require('@/lib/supabase')
      }).toThrow(/Replit Secrets/)

      process.env = envBackup
    })
  })
})
