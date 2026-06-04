/**
 * @jest-environment node
 */

import { POST } from '@/app/api/chat/route'

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const userMessage = {
  messages: [{ role: 'user', parts: [{ type: 'text', text: 'Hello there' }] }],
}

describe('POST /api/chat', () => {
  const originalEnv = process.env
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.N8N_WEBHOOK_URL
  })

  afterEach(() => {
    process.env = originalEnv
    global.fetch = originalFetch
  })

  it('streams a placeholder text response when no webhook is configured', async () => {
    const res = await POST(makeRequest(userMessage))

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/text\/plain/)

    const text = await res.text()
    expect(text).toContain('Placeholder response')
    expect(text).toContain('Hello there')
  })

  it('returns 400 when the body has no messages', async () => {
    const res = await POST(makeRequest({ foo: 'bar' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON', async () => {
    const res = await POST(
      new Request('http://localhost/api/chat', { method: 'POST', body: '{not json' })
    )
    expect(res.status).toBe(400)
  })

  it('proxies to the n8n webhook when N8N_WEBHOOK_URL is set', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example/webhook/agent'

    const encoder = new TextEncoder()
    const upstreamBody = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('hi from n8n'))
        controller.close()
      },
    })
    const fetchMock = jest
      .fn()
      .mockResolvedValue(new Response(upstreamBody, { status: 200 }))
    global.fetch = fetchMock as unknown as typeof fetch

    const res = await POST(makeRequest({
      messages: [{ role: 'user', parts: [{ type: 'text', text: 'ping' }] }],
    }))

    expect(fetchMock).toHaveBeenCalledWith(
      'https://n8n.example/webhook/agent',
      expect.objectContaining({ method: 'POST' })
    )
    const text = await res.text()
    expect(text).toContain('hi from n8n')
  })

  it('returns 502 when the n8n webhook errors', async () => {
    process.env.N8N_WEBHOOK_URL = 'https://n8n.example/webhook/agent'
    global.fetch = jest
      .fn()
      .mockResolvedValue(new Response('nope', { status: 500 })) as unknown as typeof fetch

    const res = await POST(makeRequest(userMessage))
    expect(res.status).toBe(502)
  })
})
