import type { MessageConversation, MessagesFilterParams } from './Messages.types'

export function filterMessageConversations({
  conversations,
  search,
}: MessagesFilterParams): MessageConversation[] {
  const normalizedQuery = search.trim().toLowerCase()

  if (!normalizedQuery) {
    return conversations
  }

  return conversations.filter((conversation) =>
    [conversation.buyerName, conversation.orderLabel, conversation.lastMessagePreview]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(normalizedQuery)),
  )
}

export function getConversationInitials(conversation: MessageConversation) {
  if (conversation.buyerInitials?.trim()) {
    return conversation.buyerInitials.trim().slice(0, 2).toUpperCase()
  }

  return conversation.buyerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
