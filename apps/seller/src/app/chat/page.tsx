'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Search } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { api } from '../../lib/api'

interface Conversation {
  id: string
  buyerId: string
  lastMessageText: string | null
  lastMessageAt: string | null
  sellerUnread: number
}

interface ChatMessage {
  id: string
  senderId: string
  content: string
  type: string
  isRead: boolean
  createdAt: string
}

interface ConversationsResponse {
  data: Conversation[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

interface MessagesResponse {
  data: ChatMessage[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        const res = await api<ConversationsResponse>('/chat/conversations', {
          params: { search: search || undefined },
        })
        setConversations(res.data)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchConversations()
  }, [search])

  useEffect(() => {
    if (!selectedConversation) return
    const fetchMessages = async () => {
      try {
        const res = await api<MessagesResponse>(
          `/chat/conversations/${selectedConversation}/messages`,
        )
        setMessages(res.data)
        await api(`/chat/conversations/${selectedConversation}/read`, { method: 'POST' })
      } catch {
        /* empty */
      }
    }
    fetchMessages()
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!messageText.trim() || !selectedConversation) return
    try {
      await api(`/chat/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: messageText }),
      })
      setMessageText('')
      const res = await api<MessagesResponse>(
        `/chat/conversations/${selectedConversation}/messages`,
      )
      setMessages(res.data)
    } catch {
      /* empty */
    }
  }

  return (
    <DashboardLayout>
      <PageHeader title="Chat" description="Manage buyer conversations" />

      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        style={{ height: 'calc(100vh - 220px)' }}
      >
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              )}
              {!loading && conversations.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">No conversations</div>
              )}
              {!loading && conversations.length > 0 &&
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 ${selectedConversation === conv.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">Buyer</span>
                      {conv.sellerUnread > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.sellerUnread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conv.lastMessageText ?? 'No messages'}
                    </p>
                    {conv.lastMessageAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.lastMessageAt).toLocaleString()}
                      </p>
                    )}
                  </button>
                ))
              }
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isBuyerMessage = msg.senderId === selectedConversation
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isBuyerMessage ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isBuyerMessage ? 'bg-gray-100' : 'bg-blue-600 text-white'}`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${isBuyerMessage ? 'text-gray-400' : 'text-blue-200'}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
