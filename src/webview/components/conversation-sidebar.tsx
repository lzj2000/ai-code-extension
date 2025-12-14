import { Search, X } from 'lucide-react'
import React from 'react'

import { ConversationItem } from './conversation-item'

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  timestamp: Date
}

interface ConversationSidebarProps {
  conversations: Conversation[]
  filteredConversations: Conversation[]
  selectedConversationId: string
  searchQuery: string
  onClose: () => void
  onSelectConversation: (id: string) => void
  onSearchChange: (query: string) => void
  onDeleteConversation: (id: string) => void
  formatTimestamp: (date: Date) => string
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  filteredConversations,
  selectedConversationId,
  searchQuery,
  onClose,
  onSelectConversation,
  onSearchChange,
  onDeleteConversation,
  formatTimestamp,
}) => {
  return (
    <>
      {/* 遮罩层 - 使用透明背景，点击关闭，模拟点击外部关闭的效果 */}
      <div
        className="absolute inset-0 z-10 bg-transparent"
        onClick={onClose}
      />

      {/* 对话列表侧边栏 */}
      <div className="absolute top-0 left-0 bottom-0 w-[260px] bg-sidebar border-r border-sidebar-border z-20 flex flex-col shadow-lg animate-in slide-in-from-left duration-200">
        {/* 顶部标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border/50">
          <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">历史记录</h3>
          <button
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-all"
            title="关闭侧边栏"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-8 h-8.5 bg-input/50 text-input-foreground border border-transparent focus:border-input-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-input transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-2.5 h-3.5 w-3.5 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-sm hover:bg-muted transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
          {filteredConversations.length > 0
            ? (
                <div className="space-y-0.5">
                  {filteredConversations.map(conv => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversationId === conv.id}
                      onSelect={() => {
                        onSelectConversation(conv.id)
                        onClose()
                      }}
                      onDelete={(e) => {
                        e.stopPropagation()
                        onDeleteConversation(conv.id)
                      }}
                      formatTimestamp={formatTimestamp}
                    />
                  ))}
                </div>
              )
            : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <p className="text-xs">暂无对话</p>
                </div>
              )}
        </div>

        {/* 底部信息 */}
        <div className="px-4 py-2 border-t border-sidebar-border bg-sidebar/50">
          <span className="text-[10px] text-muted-foreground">
            {conversations.length}
            {' '}
            个对话
          </span>
        </div>
      </div>
    </>
  )
}
