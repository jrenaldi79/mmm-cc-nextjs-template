/**
 * Normalize an n8n AI Agent streaming response into a plain text token stream.
 *
 * n8n streams **newline-delimited JSON (NDJSON)**, one record per line:
 *   {"type":"begin","metadata":{...}}
 *   {"type":"item","content":"2 ","metadata":{...}}
 *   {"type":"item","content":"+ 2 equals 4.","metadata":{...}}
 *   {"type":"end","metadata":{...}}
 *
 * The agent's reply is the concatenation of the `content` fields on the
 * `type:"item"` records. This transform extracts just that text so the chat UI
 * shows the reply, not the raw JSON envelopes. Lines that aren't n8n envelopes
 * (e.g. a plain-text streaming workflow) are passed through unchanged.
 */

interface N8nStreamChunk {
  type?: string;
  content?: string;
}

function emitLine(
  line: string,
  controller: TransformStreamDefaultController<string>
): void {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const chunk = JSON.parse(trimmed) as N8nStreamChunk;
    if (chunk.type === 'item' && typeof chunk.content === 'string') {
      controller.enqueue(chunk.content);
    }
    // begin/end/other envelope types carry no reply text — drop them.
  } catch {
    // Not an n8n JSON envelope: a plain-text streaming workflow. Pass it
    // through so the chat still shows something.
    controller.enqueue(line);
  }
}

export function createN8nTextStream(): TransformStream<string, string> {
  // Network chunks don't respect line boundaries, so buffer partial lines.
  let buffer = '';
  return new TransformStream<string, string>({
    transform(textChunk, controller) {
      buffer += textChunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) emitLine(line, controller);
    },
    flush(controller) {
      if (buffer) emitLine(buffer, controller);
    },
  });
}
