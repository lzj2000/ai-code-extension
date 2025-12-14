import { Menu, MessageSquarePlus, X } from 'lucide-react'
import React from 'react'

interface TopToolbarProps {
  showConversations: boolean
  onToggleConversations: (show: boolean) => void
  onNewConversation: (id: string) => void
  currentTitle: string
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  showConversations,
  onToggleConversations,
  onNewConversation,
  currentTitle,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background select-none">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => onToggleConversations(!showConversations)}
          className="h-7 w-7 shrink-0 flex items-center justify-center text-foreground hover:bg-secondary rounded-md transition-colors"
          title={showConversations ? '关闭侧边栏' : '打开侧边栏'}
        >
          {showConversations
            ? (
                <X className="h-4 w-4" />
              )
            : (
                <Menu className="h-4 w-4" />
              )}
        </button>
        <h2 className="text-sm font-medium text-foreground truncate">
          {currentTitle || '选择对话'}
        </h2>
      </div>
      <button
        onClick={() => onNewConversation(Date.now().toString())}
        className="h-7 w-7 shrink-0 flex items-center justify-center text-foreground hover:bg-secondary rounded-md transition-colors"
        title="新对话"
      >
        <MessageSquarePlus className="h-4 w-4" />
      </button>
    </div>
  )
}
