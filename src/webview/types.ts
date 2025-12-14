export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  lastMessage?: string
  timestamp: Date
}
