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

function sortConversationsByActivity(conversations: Conversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

function formatBuyerLabel(buyerId: string) {
  return `Buyer ${buyerId.slice(0, 6).toUpperCase()}`
}

function formatOrderLabel(conversationId: string) {
  return `Order ${conversationId.slice(0, 8).toUpperCase()}`
}

function formatProductLabel(conversationId: string) {
  return `Product ${conversationId.slice(-4).toUpperCase()}`
}

function formatConversationTime(value: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
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

function updateConversationsAfterSend(
  conversations: Conversation[],
  conversationId: string,
  content: string,
) {
  const sentAt = new Date().toISOString()
  const updated = conversations.map((conversation) =>
    conversation.id === conversationId
      ? {
          ...conversation,
          lastMessageText: content,
          lastMessageAt: sentAt,
          sellerUnread: 0,
        }
      : conversation,
  )

  return sortConversationsByActivity(updated)
}

function getSelectedConversationId(
  currentConversationId: string | undefined,
  conversations: Conversation[],
) {
  if (
    currentConversationId &&
    conversations.some((conversation) => conversation.id === currentConversationId)
  ) {
    return currentConversationId
  }

  return conversations[0]?.id
}

function markConversationAsRead(conversations: Conversation[], conversationId: string) {
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, sellerUnread: 0 } : conversation,
  )
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
        const sortedConversations = sortConversationsByActivity(response.data)

        setConversations(sortedConversations)
        setSelectedConversationId((current) =>
          getSelectedConversationId(current, sortedConversations),
        )
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
        setConversations((current) => markConversationAsRead(current, selectedConversationId))
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
          orderLabel: formatOrderLabel(conversation.id),
          productLabel: formatProductLabel(conversation.id),
          lastMessagePreview: conversation.lastMessageText ?? 'No messages yet',
          unreadCount: conversation.sellerUnread,
          ...(conversation.lastMessageAt ? { lastActivityAt: conversation.lastMessageAt } : {}),
          ...(lastMessageAtLabel ? { lastMessageAtLabel } : {}),
        }
      }),
    [conversations],
  )

  const uiMessages = useMemo<MessageEntry[]>(() => {
    const lastSellerMessageId = [...messages]
      .reverse()
      .find((message) => message.senderId !== selectedConversation?.buyerId)?.id

    return messages.map((message) => {
      const isBuyerMessage = message.senderId === selectedConversation?.buyerId

      return {
        id: message.id,
        sender: isBuyerMessage ? 'BUYER' : 'SELLER',
        content: message.content,
        sentAtLabel: formatMessageTime(message.createdAt),
        ...(!isBuyerMessage && message.id === lastSellerMessageId
          ? { deliveryStatus: 'DELIVERED' as const }
          : {}),
      }
    })
  }, [messages, selectedConversation?.buyerId])

  const handleSendMessage = async (conversation: MessageConversation, content: string) => {
    await api(`/chat/conversations/${conversation.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })

    const response = await api<MessagesResponse>(`/chat/conversations/${conversation.id}/messages`)
    setMessages(response.data)
    setConversations((current) => updateConversationsAfterSend(current, conversation.id, content))
  }

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
        onSendMessage={handleSendMessage}
        emptyConversationsMessage={
          loadingConversations ? 'Loading conversations...' : 'No conversations found.'
        }
        emptyMessagesMessage={loadingMessages ? 'Loading messages...' : 'No messages yet.'}
      />
    </DashboardLayout>
  )
}
