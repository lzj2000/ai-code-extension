import type { Conversation } from './types'

import React, { useState } from 'react'
import { ChatMessages } from './components/chat-messages'
import { ConversationSidebar } from './components/conversation-sidebar'
import { TopToolbar } from './components/top-toolbar'
import { useChatHistory } from './hooks/useChatHistory'
import { useChatMessages } from './hooks/useChatMessages'
import { useSendMessage } from './hooks/useSendMessage'
import { useSessionManager } from './hooks/useSessionManager'
import { generateUUID } from './utils/threadId'

const App: React.FC = () => {
  const [sessions, setSessions] = useState<Conversation[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const [showsessions, setShowsessions] = useState(false)

  // ==================== 消息管理 ====================
  // 使用 useChatMessages hook 管理所有消息相关的状态和方法
  const {
    messages, // 当前会话的所有消息
    isLoading, // 是否正在加载(发送消息中)
    setIsLoading, // 设置加载状态
    addUserMessage, // 添加用户消息
    addAssistantMessage, // 添加 AI 助手消息
    updateMessageContent, // 更新消息内容(用于流式响应)
    finishStreaming, // 完成流式传输
    addErrorMessage, // 添加错误消息
    loadMessages, // 加载历史消息
  } = useChatMessages()

  // ==================== 会话管理 ====================
  // 使用 useSessionManager hook 管理会话(session)相关状态
  const {
    sessionId, // 当前会话 ID
    sidebarRef, // 侧边栏组件引用
    createNewSession, // 创建新会话
    selectSession, // 切换会话
    updateSessionName, // 更新会话名称
    setHasUserMessage, // 设置是否有用户消息(用于判断是否需要更新会话名)
  } = useSessionManager()

  // ==================== 历史记录加载 ====================
  // 使用 useChatHistory hook 自动加载会话历史
  // 当 sessionId 变化时,会自动触发历史记录加载
  useChatHistory(sessionId, loadMessages, setHasUserMessage)

  // ==================== 消息发送 ====================
  // 使用 useSendMessage hook 处理消息发送逻辑
  const { sendMessage } = useSendMessage({
    sessionId,
    setIsLoading,
    addUserMessage,
    addAssistantMessage,
    updateMessageContent,
    finishStreaming,
    addErrorMessage,
    updateSessionName,
  })

  const currentConversation = sessions.find(
    conv => conv.id === sessionId,
  )

  // 过滤对话
  const filteredsessions = sessions.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function getSessionTitle(session: Conversation | null) {
    return session?.name || `会话 ${session?.id.slice(0, 8) || '新会话'}`
  }

  async function handleNew() {
    const id = generateUUID()
    createNewSession(id)
    setSessions(prev => [...prev, { id, name: `新会话-${id.slice(0, 8)}` }])
  }

  // ==================== 渲染 UI ====================
  return (
    <div className="h-screen bg-background text-foreground">
      <div className="relative flex flex-col h-full bg-background">
        {/* 顶部工具栏 */}
        <TopToolbar
          showConversations={showsessions}
          onToggleConversations={setShowsessions}
          onNewConversation={handleNew}
          currentTitle={getSessionTitle(currentConversation || null)}
        />

        {/* 对话列表侧边栏（可折叠） */}
        {showsessions && (
          <ConversationSidebar
            conversations={sessions}
            filteredConversations={filteredsessions}
            selectedConversationId={sessionId}
            searchQuery={searchQuery}
            onClose={() => setShowsessions(false)}
            onSelectConversation={selectSession}
            onSearchChange={setSearchQuery}
            onDeleteConversation={() => { }}
          />
        )}

        {/* 主消息区域 */}
        <div className="flex-1 overflow-hidden">
          {sessionId
            ? (
                <ChatMessages onSend={sendMessage} messages={messages} disabled={isLoading} />
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
