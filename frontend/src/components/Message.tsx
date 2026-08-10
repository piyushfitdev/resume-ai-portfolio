import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types/chat'

/** Converts escaped newlines from a streamed text response into Markdown lines. */
function normalizeAssistantMarkdown(content: string) {
  return content
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, '\t')
}

export function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return <article className={`message ${isUser ? 'user-message' : 'assistant-message'} ${message.error ? 'error-message' : ''}`}>
    {!isUser && <div className="ai-avatar">✦</div>}
    <div className="message-content">
      {!isUser && <div className="message-name">Piyush AI</div>}
      {isUser ? <p>{message.content}</p> : <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{normalizeAssistantMarkdown(message.content) || ' '}</ReactMarkdown></div>}
    </div>
  </article>
}
