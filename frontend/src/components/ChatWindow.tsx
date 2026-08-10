import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types/chat'
import { Message } from './Message'
import { WelcomeScreen } from './WelcomeScreen'

interface ChatWindowProps { messages: ChatMessage[]; isStreaming: boolean; onSuggestion: (prompt: string) => void }

export function ChatWindow({ messages, isStreaming, onSuggestion }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isStreaming])
  if (!messages.length) return <WelcomeScreen onSelect={onSuggestion} />
  return <main className="chat-window">
    <div className="messages">{messages.map(message => <Message key={message.id} message={message} />)}
      {isStreaming && <div className="streaming-status"><span /><span /><span /> Thinking</div>}
      <div ref={endRef} />
    </div>
  </main>
}
