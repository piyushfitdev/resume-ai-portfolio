import { useEffect, useRef } from 'react'

interface ChatInputProps {
  value: string
  isStreaming: boolean
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
}

export function ChatInput({ value, isStreaming, onChange, onSend, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [value])

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSend() }
  }
  return <div className="input-zone">
    <div className="input-shell">
      <textarea ref={textareaRef} value={value} onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask anything about Piyush..." rows={1} aria-label="Your message" />
      {isStreaming ? <button className="stop-button" onClick={onStop}><span /> Stop</button> : <button className="send-button" disabled={!value.trim()} onClick={onSend} aria-label="Send message">↑</button>}
    </div>
    <p className="input-note">Piyush AI can make mistakes. Verify important details.</p>
  </div>
}
