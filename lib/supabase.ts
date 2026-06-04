import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let client: SupabaseClient<Database> | null = null

/**
 * Lazily create (and cache) the Supabase client.
 *
 * Initialization is deferred until the client is first used so that the app
 * can be built without Supabase credentials present. The descriptive error is
 * only thrown when something actually tries to talk to Supabase at runtime.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment (e.g. a .env.local file or your host's environment settings)."
    )
  }

  client = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return client
}

/**
 * Proxy that forwards property access to the lazily-initialized client.
 * Lets call sites keep using `supabase.from(...)` while deferring creation
 * (and the missing-credentials error) until first access.
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getSupabaseClient(), prop, receiver)
    return typeof value === 'function' ? value.bind(getSupabaseClient()) : value
  },
})
