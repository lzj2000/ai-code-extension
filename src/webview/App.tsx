import type { Conversation } from './types'

import React, { useState } from 'react'
import { ChatMessages } from './components/chat-messages'
import { ConversationSidebar } from './components/conversation-sidebar'
import { TopToolbar } from './components/top-toolbar'

const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'React 组件设计讨论',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      title: 'TypeScript 类型问题',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '3',
      title: 'Next.js 路由优化',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ])

  const [selectedConversationId, setSelectedConversationId]
    = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConversations, setShowConversations] = useState(false)

  // 创建新对话
  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      timestamp: new Date(),
    }
    setConversations([newConv, ...conversations])
    setSelectedConversationId(newConv.id)
  }

  // 删除对话
  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id))
    if (selectedConversationId === id) {
      setSelectedConversationId(conversations[0]?.id || '')
    }
  }

  // 过滤对话
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 格式化时间
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1)
      return '刚刚'
    if (minutes < 60)
      return `${minutes}分钟前`
    if (hours < 24)
      return `${hours}小时前`
    if (days < 7)
      return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const currentConversation = conversations.find(
    conv => conv.id === selectedConversationId,
  )

  return (
    <div className="h-screen bg-background text-foreground">
      <div className="relative flex flex-col h-full bg-background">
        {/* 顶部工具栏 */}
        <TopToolbar
          showConversations={showConversations}
          onToggleConversations={setShowConversations}
          onNewConversation={handleNewConversation}
          currentTitle={currentConversation?.title || ''}
        />

        {/* 对话列表侧边栏（可折叠） */}
        {showConversations && (
          <ConversationSidebar
            conversations={conversations}
            filteredConversations={filteredConversations}
            selectedConversationId={selectedConversationId}
            searchQuery={searchQuery}
            onClose={() => setShowConversations(false)}
            onSelectConversation={setSelectedConversationId}
            onSearchChange={setSearchQuery}
            onDeleteConversation={handleDeleteConversation}
            formatTimestamp={formatTimestamp}
          />
        )}

        {/* 主消息区域 */}
        <div className="flex-1 overflow-hidden">
          {selectedConversationId
            ? (
                <ChatMessages conversationId={selectedConversationId} />
              )
            : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    点击左上角菜单选择或创建对话
                  </p>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

export default App
