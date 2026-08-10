export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: number
  error?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
}
