import type { MessageConversation, MessageEntry, MessagesProps } from './Messages.types'

export const messagesPageConversations: MessageConversation[] = [
  {
    id: 'conv-priya',
    buyerName: 'Priya R.',
    buyerInitials: 'PR',
    orderLabel: 'Order ORD-100341',
    lastMessagePreview: 'Could you confirm the warranty on this?',
    unreadCount: 2,
  },
  {
    id: 'conv-marco',
    buyerName: 'Marco D.',
    buyerInitials: 'MD',
    lastMessagePreview: 'Got it, thanks!',
    lastMessageAtLabel: '10:24 AM',
  },
  {
    id: 'conv-anya',
    buyerName: 'Anya P.',
    buyerInitials: 'AP',
    lastMessagePreview: 'Do you ship to Indonesia?',
    unreadCount: 1,
  },
  {
    id: 'conv-liam',
    buyerName: 'Liam K.',
    buyerInitials: 'LK',
    lastMessagePreview: 'Perfect, will reorder.',
    lastMessageAtLabel: 'Yesterday',
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
