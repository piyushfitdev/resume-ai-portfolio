const CHAT_URL = 'http://127.0.0.1:8000/chat'

interface StreamOptions {
  signal: AbortSignal
  onChunk: (chunk: string) => void
}

export async function streamChat(prompt: string, { signal, onChunk }: StreamOptions): Promise<void> {
  const response = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`The AI service returned ${response.status}.`)
  }
  if (!response.body) {
    throw new Error('The AI service did not return a readable stream.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      onChunk(decoder.decode(value, { stream: true }))
    }
    const remainder = decoder.decode()
    if (remainder) onChunk(remainder)
  } finally {
    reader.releaseLock()
  }
}
