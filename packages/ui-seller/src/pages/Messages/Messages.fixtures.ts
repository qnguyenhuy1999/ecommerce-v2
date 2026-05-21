import type { MessageConversation, MessageEntry, MessagesProps } from './Messages.types'

export const messagesPageConversations: MessageConversation[] = [
  {
    id: 'conv-priya',
    buyerName: 'Priya R.',
    buyerInitials: 'PR',
    orderLabel: 'Order ORD-100341',
    productLabel: 'AeroShell Helmet',
    lastMessagePreview: 'Could you confirm the warranty on this?',
    unreadCount: 2,
    lastActivityAt: '2026-05-21T10:14:00.000Z',
  },
  {
    id: 'conv-marco',
    buyerName: 'Marco D.',
    buyerInitials: 'MD',
    orderLabel: 'Order ORD-100287',
    productLabel: 'TrailGuard Gloves',
    lastMessagePreview: 'Got it, thanks!',
    lastMessageAtLabel: '10:24 AM',
    lastActivityAt: '2026-05-21T10:24:00.000Z',
  },
  {
    id: 'conv-anya',
    buyerName: 'Anya P.',
    buyerInitials: 'AP',
    orderLabel: 'Order ORD-100198',
    productLabel: 'All-Weather Cover',
    lastMessagePreview: 'Do you ship to Indonesia?',
    unreadCount: 1,
    lastActivityAt: '2026-05-21T09:41:00.000Z',
  },
  {
    id: 'conv-liam',
    buyerName: 'Liam K.',
    buyerInitials: 'LK',
    orderLabel: 'Order ORD-100112',
    productLabel: 'StreetLock Disc Brake',
    lastMessagePreview: 'Perfect, will reorder.',
    lastMessageAtLabel: 'Yesterday',
    lastActivityAt: '2026-05-20T18:10:00.000Z',
  },
]

export const messagesPageEntries: MessageEntry[] = [
  {
    id: 'msg-1',
    sender: 'BUYER',
    content: 'Hi, is the warranty international?',
    sentAtLabel: '10:12 AM',
  },
  {
    id: 'msg-2',
    sender: 'SELLER',
    content: 'Yes, 12 months worldwide.',
    sentAtLabel: '10:13 AM',
    deliveryStatus: 'READ',
  },
  {
    id: 'msg-3',
    sender: 'BUYER',
    content: 'Could you confirm the warranty on this?',
    sentAtLabel: '10:14 AM',
  },
]

const defaultSelectedConversationId = 'conv-priya'

export const messagesDefaultProps = {
  title: 'Messages',
  description: 'Conversations with buyers',
  conversations: messagesPageConversations,
  messages: messagesPageEntries,
  defaultSelectedConversationId,
  searchPlaceholder: 'Search threads...',
  draftMessage: '',
  composerPlaceholder: 'Type your reply...',
  loadingConversations: false,
  loadingMessages: false,
  emptyConversationsMessage: 'No conversations found.',
  emptyMessagesMessage: 'No messages yet.',
  unselectedConversationMessage: 'Select a conversation to view messages.',
  onSendMessage: async () => {},
} satisfies Required<
  Pick<
    MessagesProps,
    | 'title'
    | 'description'
    | 'conversations'
    | 'messages'
    | 'defaultSelectedConversationId'
    | 'searchPlaceholder'
    | 'draftMessage'
    | 'composerPlaceholder'
    | 'loadingConversations'
    | 'loadingMessages'
    | 'emptyConversationsMessage'
    | 'emptyMessagesMessage'
    | 'unselectedConversationMessage'
    | 'onSendMessage'
  >
>
