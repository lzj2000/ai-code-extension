"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatMessagesProps {
  conversationId: string;
}

export function ChatMessages({ conversationId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "你好！我是 AI 助手，有什么可以帮助你的吗？",
      role: "assistant",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 模拟流式响应
  const simulateStreamingResponse = async (userMessage: string) => {
    const responses = [
      "这是一个很好的问题。让我来为你详细解答...",
      "根据我的理解，我们可以从以下几个方面来看待这个问题：\n\n1. 首先，需要考虑的是基础架构\n2. 其次，要关注性能优化\n3. 最后，不要忘记用户体验",
      "当然，我很乐意帮助你！基于你的问题，我建议你可以尝试以下几种方法来解决这个问题...",
    ];

    const responseText =
      responses[Math.floor(Math.random() * responses.length)];

    // 创建新的流式消息
    const streamingMessageId = Date.now().toString();
    const newMessage: Message = {
      id: streamingMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsStreaming(true);

    // 模拟逐字输出
    for (let i = 0; i <= responseText.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? { ...msg, content: responseText.slice(0, i) }
            : msg
        )
      );
    }

    // 流式结束
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === streamingMessageId ? { ...msg, isStreaming: false } : msg
      )
    );
    setIsStreaming(false);
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // 模拟 AI 响应
    await simulateStreamingResponse(inputValue);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [inputValue]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* 消息区域 */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 items-start ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* 头像 */}
              <div
                className={`h-8 w-8 shrink-0 rounded-full border border-[#3c3c3c] flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-[#007acc] text-white"
                    : "bg-[#3c3c3c] text-[#cccccc]"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* 消息内容 */}
              <div
                className={`flex flex-col gap-1 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[85%] ${
                    message.role === "user"
                      ? "bg-[#007acc] text-white"
                      : "bg-[#2d2d2d] text-[#cccccc]"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse" />
                    )}
                  </p>
                </div>
                <span className="text-xs text-[#858585] px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-[#2d2d2d] p-3 bg-[#252526]">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            placeholder="输入消息..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            className="flex-1 min-h-[40px] max-h-[160px] resize-none bg-[#3c3c3c] border border-[#3c3c3c] rounded text-[#cccccc] text-sm placeholder:text-[#858585] focus:outline-none focus:ring-1 focus:ring-[#007acc] px-3 py-2"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isStreaming}
            className="h-[40px] w-[40px] shrink-0 flex items-center justify-center bg-[#007acc] hover:bg-[#005a9e] text-white disabled:bg-[#3c3c3c] disabled:text-[#858585] rounded transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-[#858585] text-center mt-2">
          Enter 发送，Shift+Enter 换行
        </p>
      </div>
    </div>
  );
}
