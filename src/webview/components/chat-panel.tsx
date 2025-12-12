"use client";

import { useState } from "react";
import {
  MessageSquarePlus,
  MoreVertical,
  Trash2,
  Search,
  Menu,
  X,
} from "lucide-react";
import { ChatMessages } from "./chat-messages";

// 对话类型定义
interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
}

export function ChatPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "React 组件设计讨论",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      title: "TypeScript 类型问题",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      title: "Next.js 路由优化",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConversations, setShowConversations] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // 创建新对话
  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "新对话",
      timestamp: new Date(),
    };
    setConversations([newConv, ...conversations]);
    setSelectedConversationId(newConv.id);
  };

  // 删除对话
  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (selectedConversationId === id) {
      setSelectedConversationId(conversations[0]?.id || "");
    }
    setShowDropdown(null);
  };

  // 过滤对话
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 格式化时间
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  return (
    <div className="relative flex flex-col h-full bg-[#1e1e1e]">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#2d2d2d] bg-[#252526]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => setShowConversations(!showConversations)}
            className="h-8 w-8 shrink-0 flex items-center justify-center text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white rounded transition-colors"
          >
            {showConversations ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
          <h2 className="text-sm font-medium text-[#cccccc] truncate">
            {currentConversation?.title || "选择对话"}
          </h2>
        </div>
        <button
          onClick={handleNewConversation}
          className="h-8 w-8 shrink-0 flex items-center justify-center text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white rounded transition-colors"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </button>
      </div>

      {/* 对话列表侧边栏（可折叠） */}
      {showConversations && (
        <>
          {/* 遮罩层 */}
          <div
            className="absolute inset-0 bg-black/50 z-10"
            onClick={() => setShowConversations(false)}
          />

          {/* 对话列表抽屉 */}
          <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-[#252526] border-r border-[#2d2d2d] z-20 flex flex-col">
            {/* 抽屉顶部 */}
            <div className="flex items-center justify-between p-3 border-b border-[#2d2d2d]">
              <h3 className="text-sm font-semibold text-[#cccccc]">所有对话</h3>
              <button
                onClick={() => setShowConversations(false)}
                className="h-7 w-7 flex items-center justify-center text-[#cccccc] hover:bg-[#2d2d2d] hover:text-white rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 搜索栏 */}
            <div className="p-3 border-b border-[#2d2d2d]">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#858585]" />
                <input
                  type="text"
                  placeholder="搜索对话..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 h-9 bg-[#3c3c3c] border border-[#3c3c3c] rounded text-[#cccccc] text-sm placeholder:text-[#858585] focus:outline-none focus:ring-1 focus:ring-[#007acc]"
                />
              </div>
            </div>

            {/* 对话列表 */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-start gap-2 p-2.5 mb-1 rounded cursor-pointer transition-colors relative ${
                    selectedConversationId === conv.id
                      ? "bg-[#37373d]"
                      : "hover:bg-[#2a2d2e]"
                  }`}
                  onClick={() => {
                    setSelectedConversationId(conv.id);
                    setShowConversations(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-[#cccccc] truncate">
                        {conv.title}
                      </h3>
                      <span className="text-xs text-[#858585] ml-2 flex-shrink-0">
                        {formatTimestamp(conv.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* 更多操作按钮 */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(
                          showDropdown === conv.id ? null : conv.id
                        );
                      }}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#cccccc] hover:bg-[#3c3c3c] hover:text-white rounded flex-shrink-0"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>

                    {/* 下拉菜单 */}
                    {showDropdown === conv.id && (
                      <div className="absolute right-0 top-7 bg-[#3c3c3c] border border-[#454545] rounded shadow-lg z-30 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conv.id);
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#2d2d2d] transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          删除对话
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部状态栏 */}
            <div className="p-2 border-t border-[#2d2d2d]">
              <p className="text-xs text-[#858585] text-center">
                共 {conversations.length} 个对话
              </p>
            </div>
          </div>
        </>
      )}

      {/* 主消息区域 */}
      <div className="flex-1 overflow-hidden">
        {selectedConversationId ? (
          <ChatMessages conversationId={selectedConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#858585]">
              点击左上角菜单选择或创建对话
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
