/* eslint-disable max-lines-per-function */
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
    void fetchConversations()
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
    void fetchMessages()
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
        className="overflow-hidden rounded-lg border border-gray-200 bg-white"
        style={{ height: 'calc(100vh - 220px)' }}
      >
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="flex w-80 flex-col border-r border-gray-200">
            <div className="border-b border-gray-200 p-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded bg-gray-100" />
                  ))}
                </div>
              )}
              {!loading && conversations.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">No conversations</div>
              )}
              {!loading &&
                conversations.length > 0 &&
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full border-b border-gray-100 p-3 text-left hover:bg-gray-50 ${selectedConversation === conv.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-medium">Buyer</span>
                      {conv.sellerUnread > 0 && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                          {conv.sellerUnread}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {conv.lastMessageText ?? 'No messages'}
                    </p>
                    {conv.lastMessageAt && (
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(conv.lastMessageAt).toLocaleString()}
                      </p>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Messages area */}
          <div className="flex flex-1 flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.map((msg) => {
                    const isBuyerMessage = msg.senderId === selectedConversation
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isBuyerMessage ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-4 py-2 text-sm ${isBuyerMessage ? 'bg-gray-100' : 'bg-blue-600 text-white'}`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`mt-1 text-xs ${isBuyerMessage ? 'text-gray-400' : 'text-blue-200'}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="border-t border-gray-200 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void handleSend()
                      }}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => void handleSend()}
                      disabled={!messageText.trim()}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
