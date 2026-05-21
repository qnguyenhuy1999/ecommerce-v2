import { ConsolePageLayout } from '@ecom/core-ui'
import { MessagesClient } from './Messages.client'
import { messagesDefaultProps } from './Messages.fixtures'
import type { MessagesProps } from './Messages.types'
import { filterMessageConversations } from './Messages.utils'

export function Messages({
  title = messagesDefaultProps.title,
  description = messagesDefaultProps.description,
  conversations = messagesDefaultProps.conversations,
  messages = messagesDefaultProps.messages,
  selectedConversationId,
  defaultSelectedConversationId = messagesDefaultProps.defaultSelectedConversationId,
  onSelectedConversationChange,
  search,
  onSearchChange,
  searchPlaceholder = messagesDefaultProps.searchPlaceholder,
  draftMessage = messagesDefaultProps.draftMessage,
  onDraftMessageChange,
  composerPlaceholder = messagesDefaultProps.composerPlaceholder,
  onSendMessage = messagesDefaultProps.onSendMessage,
  loadingConversations = messagesDefaultProps.loadingConversations,
  loadingMessages = messagesDefaultProps.loadingMessages,
  emptyConversationsMessage = messagesDefaultProps.emptyConversationsMessage,
  emptyMessagesMessage = messagesDefaultProps.emptyMessagesMessage,
  unselectedConversationMessage = messagesDefaultProps.unselectedConversationMessage,
  filterConversations = filterMessageConversations,
}: MessagesProps) {
  return (
    <ConsolePageLayout title={title} description={description}>
      <MessagesClient
        conversations={conversations}
        messages={messages}
        {...(selectedConversationId !== undefined ? { selectedConversationId } : {})}
        defaultSelectedConversationId={defaultSelectedConversationId}
        {...(onSelectedConversationChange !== undefined ? { onSelectedConversationChange } : {})}
        {...(search !== undefined ? { search } : {})}
        {...(onSearchChange !== undefined ? { onSearchChange } : {})}
        searchPlaceholder={searchPlaceholder}
        draftMessage={draftMessage}
        {...(onDraftMessageChange ? { onDraftMessageChange } : {})}
        composerPlaceholder={composerPlaceholder}
        onSendMessage={onSendMessage}
        loadingConversations={loadingConversations}
        loadingMessages={loadingMessages}
        emptyConversationsMessage={emptyConversationsMessage}
        emptyMessagesMessage={emptyMessagesMessage}
        unselectedConversationMessage={unselectedConversationMessage}
        filterConversations={filterConversations}
      />
    </ConsolePageLayout>
  )
}
