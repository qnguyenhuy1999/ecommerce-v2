'use client'

import { Messages, type MessageConversation, type MessageEntry } from '@ecom/ui-seller'
import { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
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
  createdAt: string
}

interface ConversationsResponse {
  data: Conversation[]
}

interface MessagesResponse {
  data: ChatMessage[]
}

function formatBuyerLabel(buyerId: string) {
  return `Buyer ${buyerId.slice(0, 6).toUpperCase()}`
}

function formatConversationTime(value: string | null) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatMessageTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [search, setSearch] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true)

      try {
        const response = await api<ConversationsResponse>('/chat/conversations', {
          params: { ...(search ? { search } : {}) },
        })

        setConversations(response.data)
        setSelectedConversationId((current) => {
          if (current && response.data.some((conversation) => conversation.id === current)) {
            return current
          }

          return response.data[0]?.id
        })
      } catch {
        setConversations([])
        setSelectedConversationId(undefined)
      } finally {
        setLoadingConversations(false)
      }
    }

    void fetchConversations()
  }, [search])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      setLoadingMessages(true)

      try {
        const response = await api<MessagesResponse>(
          `/chat/conversations/${selectedConversationId}/messages`,
        )
        setMessages(response.data)
        await api(`/chat/conversations/${selectedConversationId}/read`, { method: 'POST' })
        setConversations((current) =>
          current.map((conversation) =>
            conversation.id === selectedConversationId
              ? { ...conversation, sellerUnread: 0 }
              : conversation,
          ),
        )
      } catch {
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    void fetchMessages()
  }, [selectedConversationId])

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId),
    [conversations, selectedConversationId],
  )

  const uiConversations = useMemo<MessageConversation[]>(
    () =>
      conversations.map((conversation) => {
        const lastMessageAtLabel = formatConversationTime(conversation.lastMessageAt)

        return {
          id: conversation.id,
          buyerName: formatBuyerLabel(conversation.buyerId),
          buyerInitials: 'BY',
          lastMessagePreview: conversation.lastMessageText ?? 'No messages yet',
          unreadCount: conversation.sellerUnread,
          ...(lastMessageAtLabel ? { lastMessageAtLabel } : {}),
        }
      }),
    [conversations],
  )

  const uiMessages = useMemo<MessageEntry[]>(
    () =>
      messages.map((message) => ({
        id: message.id,
        sender: message.senderId === selectedConversation?.buyerId ? 'BUYER' : 'SELLER',
        content: message.content,
        sentAtLabel: formatMessageTime(message.createdAt),
      })),
    [messages, selectedConversation?.buyerId],
  )

  return (
    <DashboardLayout>
      <Messages
        conversations={uiConversations}
        messages={uiMessages}
        {...(selectedConversationId ? { selectedConversationId } : {})}
        onSelectedConversationChange={setSelectedConversationId}
        search={search}
        onSearchChange={setSearch}
        loadingConversations={loadingConversations}
        loadingMessages={loadingMessages}
        onSendMessage={async (conversation, content) => {
          await api(`/chat/conversations/${conversation.id}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content }),
          })

          const response = await api<MessagesResponse>(`/chat/conversations/${conversation.id}/messages`)
          setMessages(response.data)
          setConversations((current) => {
            const updated = current.map((item) =>
              item.id === conversation.id
                ? {
                    ...item,
                    lastMessageText: content,
                    lastMessageAt: new Date().toISOString(),
                    sellerUnread: 0,
                  }
                : item,
            )

            return updated.sort((left, right) => {
              const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
              const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
              return rightTime - leftTime
            })
          })
        }}
        emptyConversationsMessage={
          loadingConversations ? 'Loading conversations...' : 'No conversations found.'
        }
        emptyMessagesMessage={loadingMessages ? 'Loading messages...' : 'No messages yet.'}
      />
    </DashboardLayout>
  )
}
