export type MessageSender = 'BUYER' | 'SELLER'
export type MessageDeliveryStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'

export interface MessageConversation {
  id: string
  buyerName: string
  buyerAvatarSrc?: string
  buyerInitials?: string
  orderLabel?: string
  productLabel?: string
  lastMessagePreview?: string
  lastMessageAtLabel?: string
  lastActivityAt?: string
  unreadCount?: number
}

export interface MessageEntry {
  id: string
  sender: MessageSender
  content: string
  sentAtLabel?: string
  deliveryStatus?: MessageDeliveryStatus
}

export interface MessagesFilterParams {
  conversations: MessageConversation[]
  search: string
}

export interface MessagesProps {
  title?: string
  description?: string
  conversations?: MessageConversation[]
  messages?: MessageEntry[]
  selectedConversationId?: string
  defaultSelectedConversationId?: string
  onSelectedConversationChange?: (conversationId: string) => void
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  draftMessage?: string
  onDraftMessageChange?: (value: string) => void
  composerPlaceholder?: string
  onSendMessage?: (conversation: MessageConversation, content: string) => void | Promise<void>
  loadingConversations?: boolean
  loadingMessages?: boolean
  emptyConversationsMessage?: string
  emptyMessagesMessage?: string
  unselectedConversationMessage?: string
  filterConversations?: (params: MessagesFilterParams) => MessageConversation[]
}
