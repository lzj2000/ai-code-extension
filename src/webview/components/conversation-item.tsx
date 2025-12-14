import { Trash2 } from 'lucide-react'
import React from 'react'

interface Conversation {
  id: string
  name: string
}

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className={`group flex items-center gap-2 px-2 py-2 mb-0.5 rounded-md cursor-pointer transition-colors relative select-none ${
        isSelected
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground'
      }`}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm truncate pr-2 ${isSelected ? 'font-medium' : ''}`}>
            {conversation.name}
          </h3>
        </div>
      </div>

      {/* 删除按钮 - Hover 显示，绝对定位在右侧覆盖时间戳 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(e)
        }}
        className={`absolute right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md flex-shrink-0 ${
          isSelected
            ? 'text-sidebar-primary-foreground hover:bg-white/20'
            : 'text-muted-foreground hover:text-destructive hover:bg-sidebar-accent'
        }`}
        name="删除对话"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
