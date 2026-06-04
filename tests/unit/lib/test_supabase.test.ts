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

    // The client is created lazily — accessing a property triggers init
    expect(supabase).toBeDefined()
    expect(supabase.from).toBeDefined()

    // Verify createClient was called with the correct parameters
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
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

      const { supabase } = require('@/lib/supabase')
      // The error surfaces on first use, not on import
      expect(() => supabase.from).toThrow('Missing Supabase environment variables')
    })
  })

  it('should throw error when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    jest.isolateModules(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ''

      const { supabase } = require('@/lib/supabase')
      expect(() => supabase.from).toThrow('Missing Supabase environment variables')
    })
  })

  it('should throw error when both environment variables are missing', () => {
    jest.isolateModules(() => {
      const envBackup = { ...process.env }
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const { supabase } = require('@/lib/supabase')
      expect(() => supabase.from).toThrow('Missing Supabase environment variables')

      process.env = envBackup
    })
  })

  it('should include helpful error message about environment variables', () => {
    jest.isolateModules(() => {
      const envBackup = { ...process.env }
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const { supabase } = require('@/lib/supabase')
      expect(() => supabase.from).toThrow(/environment/)

      process.env = envBackup
    })
  })

  it('should not throw or create a client at import time', () => {
    jest.isolateModules(() => {
      const envBackup = { ...process.env }
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Importing the module must succeed even without credentials so the
      // app can be built without Supabase configured.
      expect(() => require('@/lib/supabase')).not.toThrow()

      process.env = envBackup
    })
  })
})
