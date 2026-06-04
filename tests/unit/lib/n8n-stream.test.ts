/**
 * @jest-environment node
 */

import { createN8nTextStream } from '@/lib/n8n-stream';

/** Pipe a list of string chunks through the transform and collect the output. */
async function run(chunks: string[]): Promise<string> {
  const source = new ReadableStream<string>({
    start(controller) {
      for (const c of chunks) controller.enqueue(c);
      controller.close();
    },
  });

  const out = source.pipeThrough(createN8nTextStream());
  const reader = out.getReader();
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += value;
  }
  return text;
}

const NDJSON = [
  '{"type":"begin","metadata":{"nodeName":"AI Agent1"}}',
  '{"type":"item","content":"2 ","metadata":{}}',
  '{"type":"item","content":"+ 2 equals 4.","metadata":{}}',
  '{"type":"end","metadata":{}}',
].join('\n');

describe('createN8nTextStream', () => {
  it('emits only the content from item chunks, ignoring begin/end', async () => {
    expect(await run([NDJSON])).toBe('2 + 2 equals 4.');
  });

  it('reassembles content when lines are split across network chunks', async () => {
    // Split mid-line to exercise the internal line buffer.
    const half = Math.floor(NDJSON.length / 2);
    const text = await run([NDJSON.slice(0, half), NDJSON.slice(half)]);
    expect(text).toBe('2 + 2 equals 4.');
  });

  it('handles a trailing line with no final newline (flush)', async () => {
    const text = await run([
      '{"type":"item","content":"hello"}\n{"type":"item","content":" world"}',
    ]);
    expect(text).toBe('hello world');
  });

  it('ignores blank lines and non-item chunk types', async () => {
    const text = await run([
      '\n{"type":"begin"}\n\n{"type":"item","content":"hi"}\n{"type":"other"}\n',
    ]);
    expect(text).toBe('hi');
  });

  it('passes raw (non-JSON) lines through so plain-text workflows still stream', async () => {
    const text = await run(['hi from n8n\n']);
    expect(text).toContain('hi from n8n');
  });

  it('decodes escaped newlines in content into a real multi-line reply', async () => {
    // Mirrors a real n8n response: markdown with \n escapes inside the JSON
    // string. Each record is one physical line; the \n must survive as a real
    // newline so react-markdown renders headings/lists correctly.
    const records = [
      '{"type":"begin","metadata":{}}',
      '{"type":"item","content":"## Title\\n\\n1. **One** – first\\n"}',
      '{"type":"item","content":"2. **Two** – second\\n\\nDone."}',
      '{"type":"end","metadata":{}}',
    ];
    const ndjson = records.join('\n');

    // Feed it byte-by-byte to stress the partial-line buffer across reads.
    const chars = ndjson.split('');
    const text = await run(chars);

    expect(text).toBe(
      '## Title\n\n1. **One** – first\n2. **Two** – second\n\nDone.'
    );
    // The literal backslash-n escape must not leak through unparsed.
    expect(text).not.toContain('\\n');
  });
});
