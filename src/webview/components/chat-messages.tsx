'use client'

import type React from 'react'
import type { Message } from '../types'
import { Bot, Send, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { Textarea } from './ui/textarea'

interface ChatMessagesProps {
  onSend: (message: string) => void
  disabled?: boolean
  messages: Message[]
}

export function ChatMessages({ onSend, disabled, messages }: ChatMessagesProps) {
  const [inputValue, setInputValue] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 发送消息
  const handleonSend = async () => {
    if (!inputValue.trim() || disabled)
      return

    const input = inputValue
    setInputValue('')

    await onSend(input)
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleonSend()
    }
  }

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 消息区域 */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6 pb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 items-start ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* 头像 */}
              <div
                className={`h-8 w-8 shrink-0 rounded-full border flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border'
                }`}
              >
                {message.role === 'user'
                  ? <User className="h-4 w-4" />
                  : <Bot className="h-4 w-4" />}
              </div>

              {/* 消息内容 */}
              <div
                className={`flex flex-col gap-1.5 ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2.5 max-w-[85%] shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse align-middle" />
                    )}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 输入区域 */}
      <div className="p-4 pb-4 bg-background">
        <div className="relative flex flex-col border border-input-border rounded-xl bg-input/50 focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all">
          <Textarea
            placeholder="输入消息..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1 min-h-[52px] max-h-[200px] w-full resize-none bg-transparent border-none text-input-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none p-3 pb-10"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <p className="text-[10px] text-muted-foreground hidden sm:block mr-2 select-none">
              Enter 发送
            </p>
            <button
              onClick={handleonSend}
              disabled={!inputValue.trim() || disabled}
              className="h-8 w-8 shrink-0 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
