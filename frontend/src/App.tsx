import { useRef, useState } from 'react'
import { streamChat } from './api/chat'
import { ChatInput } from './components/ChatInput'
import { ChatWindow } from './components/ChatWindow'
import { Sidebar } from './components/Sidebar'
import type { ChatMessage, Conversation } from './types/chat'

const createConversation = (): Conversation => ({ id: crypto.randomUUID(), title: 'New conversation', messages: [] })
const makeMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({ id: crypto.randomUUID(), role, content, createdAt: Date.now() })

export default function App() {
  const firstConversation = useRef(createConversation())
  const [conversations, setConversations] = useState<Conversation[]>([firstConversation.current])
  const [activeId, setActiveId] = useState(firstConversation.current.id)
  const [draft, setDraft] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const activeConversation = conversations.find(conversation => conversation.id === activeId) ?? conversations[0]

  const updateMessages = (conversationId: string, updater: (messages: ChatMessage[]) => ChatMessage[]) => {
    setConversations(items => items.map(item => item.id === conversationId ? { ...item, messages: updater(item.messages) } : item))
  }

  const startNewChat = () => {
    controllerRef.current?.abort()
    const conversation = createConversation()
    setConversations(items => [conversation, ...items])
    setActiveId(conversation.id)
    setDraft('')
    setSidebarOpen(false)
  }

  const sendMessage = async (providedPrompt?: string) => {
    const prompt = (providedPrompt ?? draft).trim()
    if (!prompt || isStreaming) return
    const conversationId = activeId
    const userMessage = makeMessage('user', prompt)
    const assistantMessage = makeMessage('assistant', '')
    setDraft('')
    updateMessages(conversationId, messages => [...messages, userMessage, assistantMessage])
    setConversations(items => items.map(item => item.id === conversationId ? { ...item, title: item.messages.length ? item.title : prompt.slice(0, 34) } : item))
    setSidebarOpen(false)
    setIsStreaming(true)
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      await streamChat(prompt, { signal: controller.signal, onChunk: chunk => updateMessages(conversationId, messages => messages.map(message => message.id === assistantMessage.id ? { ...message, content: message.content + chunk } : message)) })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      const detail = error instanceof Error ? error.message : 'Unable to connect to the AI service.'
      updateMessages(conversationId, messages => messages.map(message => message.id === assistantMessage.id ? { ...message, content: `**Connection problem**\n\n${detail}\n\nPlease make sure the FastAPI server is running at \`http://127.0.0.1:8000\`, then retry.`, error: true } : message))
    } finally {
      if (controllerRef.current === controller) { controllerRef.current = null; setIsStreaming(false) }
    }
  }

  const retry = () => {
    const lastUser = [...activeConversation.messages].reverse().find(message => message.role === 'user')
    if (lastUser) sendMessage(lastUser.content)
  }

  return <div className="app-shell">
    <Sidebar conversations={conversations} activeId={activeId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNew={startNewChat} onSelect={id => { setActiveId(id); setSidebarOpen(false) }} />
    <div className="main-panel">
      <header className="mobile-header"><button onClick={() => setSidebarOpen(true)} aria-label="Open menu">☰</button><span>Piyush <b>AI</b></span><span className="online-dot" /></header>
      <ChatWindow messages={activeConversation.messages} isStreaming={isStreaming} onSuggestion={sendMessage} />
      {activeConversation.messages.some(message => message.error) && !isStreaming && <button className="retry" onClick={retry}>↻ Retry last question</button>}
      <ChatInput value={draft} isStreaming={isStreaming} onChange={setDraft} onSend={() => sendMessage()} onStop={() => controllerRef.current?.abort()} />
    </div>
  </div>
}
