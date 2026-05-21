'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Input,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Inbox,
  Package,
  Search,
  SearchX,
  SendHorizontal,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { messagesDefaultProps } from './Messages.fixtures'
import { useMessagesController } from './hook'
import type {
  MessageConversation,
  MessageDeliveryStatus,
  MessageEntry,
  MessagesProps,
} from './Messages.types'
import { filterMessageConversations, getConversationInitials } from './Messages.utils'

interface MessagesClientProps {
  conversations: MessageConversation[]
  messages: MessageEntry[]
  selectedConversationId?: MessagesProps['selectedConversationId']
  defaultSelectedConversationId?: MessagesProps['defaultSelectedConversationId']
  onSelectedConversationChange?: MessagesProps['onSelectedConversationChange']
  search?: MessagesProps['search']
  onSearchChange?: MessagesProps['onSearchChange']
  searchPlaceholder?: MessagesProps['searchPlaceholder']
  draftMessage?: MessagesProps['draftMessage']
  onDraftMessageChange?: MessagesProps['onDraftMessageChange']
  composerPlaceholder?: MessagesProps['composerPlaceholder']
  onSendMessage?: MessagesProps['onSendMessage']
  loadingConversations?: MessagesProps['loadingConversations']
  loadingMessages?: MessagesProps['loadingMessages']
  emptyConversationsMessage?: MessagesProps['emptyConversationsMessage']
  emptyMessagesMessage?: MessagesProps['emptyMessagesMessage']
  unselectedConversationMessage?: MessagesProps['unselectedConversationMessage']
  filterConversations?: MessagesProps['filterConversations']
}

interface ConversationSidebarProps {
  conversations: MessageConversation[]
  selectedConversation: MessageConversation | undefined
  search: string
  searchPlaceholder: string
  loading: boolean
  emptyMessage: string
  onSearchChange: (value: string) => void
  onSelectConversation: (conversationId: string) => void
}

interface ConversationItemProps {
  conversation: MessageConversation
  isSelected: boolean
  onSelect: (conversationId: string) => void
}

interface EmptyPanelProps {
  icon: typeof Inbox
  title: string
  message: string
  guidance?: string
}

interface MessagePaneProps {
  selectedConversation: MessageConversation | undefined
  messages: MessageEntry[]
  loading: boolean
  emptyMessage: string
  unselectedMessage: string
  composerPlaceholder: string
  draftMessage: string
  sending: boolean
  isMobileDetailView: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  messagesScrollRef: React.RefObject<HTMLDivElement | null>
  onBackToList: () => void
  onMessagesScroll: () => void
  onDraftMessageChange: (value: string) => void
  onSendMessage: () => Promise<void>
}

interface MessageComposerProps {
  draftMessage: string
  composerPlaceholder: string
  sending: boolean
  onDraftMessageChange: (value: string) => void
  onSendMessage: () => Promise<void>
}

function getDeliveryStatusLabel(status: MessageDeliveryStatus) {
  switch (status) {
    case 'SENDING':
      return 'Sending'
    case 'SENT':
      return 'Sent'
    case 'DELIVERED':
      return 'Delivered'
    case 'READ':
      return 'Read'
    case 'FAILED':
      return 'Failed'
    default:
      return status
  }
}

function ConversationListSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border-border/60 flex items-center gap-3 rounded-2xl border p-3">
          <div className="bg-muted size-11 animate-pulse rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="bg-muted h-4 w-24 animate-pulse rounded-full" />
            <div className="bg-muted h-3 w-40 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className={item % 2 === 0 ? 'flex justify-end' : 'flex justify-start'}>
          <div className="space-y-2">
            <div className="bg-muted h-11 w-56 animate-pulse rounded-2xl" />
            <div className="bg-muted h-3 w-16 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyPanel({ icon: Icon, title, message, guidance }: EmptyPanelProps) {
  return (
    <div className="text-muted-foreground flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <div className="bg-muted/70 text-foreground mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="size-5" />
      </div>
      <Typography variant="label" className="text-foreground">
        {title}
      </Typography>
      <Typography variant="body-sm" className="mt-1 max-w-sm">
        {message}
      </Typography>
      {guidance ? (
        <Typography variant="caption" className="mt-2 max-w-sm">
          {guidance}
        </Typography>
      ) : null}
    </div>
  )
}

function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  const hasUnread = (conversation.unreadCount ?? 0) > 0

  return (
    <button
      type="button"
      aria-current={isSelected ? 'page' : undefined}
      aria-label={`Open conversation with ${conversation.buyerName}`}
      onClick={() => {
        onSelect(conversation.id)
      }}
      className={`border-border/80 hover:bg-muted/60 relative flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors ${
        isSelected
          ? 'bg-primary/8 ring-primary/25 z-10 shadow-[inset_4px_0_0_0_hsl(var(--primary))]'
          : hasUnread
            ? 'bg-primary/4'
            : 'bg-transparent'
      }`}
    >
      <Avatar
        size="lg"
        className={`mt-0.5 ${hasUnread ? 'ring-primary/25 ring-2 ring-offset-2 ring-offset-transparent' : ''}`}
      >
        {conversation.buyerAvatarSrc ? (
          <AvatarImage src={conversation.buyerAvatarSrc} alt={conversation.buyerName} />
        ) : null}
        <AvatarFallback>{getConversationInitials(conversation)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className={`truncate text-base ${hasUnread || isSelected ? 'text-foreground font-semibold' : 'text-foreground/90 font-medium'}`}
            >
              {conversation.buyerName}
            </div>
            {conversation.orderLabel ? (
              <div className="text-muted-foreground truncate text-sm">
                {conversation.orderLabel}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {conversation.lastMessageAtLabel ? (
              <span className="text-muted-foreground/80 text-xs">
                {conversation.lastMessageAtLabel}
              </span>
            ) : null}
            {conversation.unreadCount ? (
              <Badge className="rounded-full px-2 py-0.5 text-xs">{conversation.unreadCount}</Badge>
            ) : null}
          </div>
        </div>

        {conversation.lastMessagePreview ? (
          <Typography
            variant="body-sm"
            className={`mt-1 truncate text-sm ${hasUnread ? 'text-foreground/85 font-medium' : 'text-muted-foreground'}`}
          >
            {conversation.lastMessagePreview}
          </Typography>
        ) : null}
      </div>
    </button>
  )
}

function ConversationSidebar({
  conversations,
  selectedConversation,
  search,
  searchPlaceholder,
  loading,
  emptyMessage,
  onSearchChange,
  onSelectConversation,
}: ConversationSidebarProps) {
  return (
    <aside className="border-border/80 flex min-h-0 min-w-0 flex-col border-b md:w-88 md:shrink-0 md:border-r md:border-b-0">
      <div className="border-border/80 border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            value={search}
            aria-label="Search conversations"
            onChange={(event) => {
              onSearchChange(event.target.value)
            }}
            placeholder={searchPlaceholder}
            className="h-11 rounded-2xl pl-11"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto" aria-label="Conversation list">
        {loading ? <ConversationListSkeleton /> : null}

        {!loading && conversations.length === 0 ? (
          <EmptyPanel
            icon={search.trim() ? SearchX : Inbox}
            title={search.trim() ? 'No matching conversations' : 'No conversations yet'}
            message={emptyMessage}
            guidance={
              search.trim()
                ? 'Try a buyer name, order number, or a shorter keyword.'
                : 'New buyer threads will appear here as soon as they start a chat.'
            }
          />
        ) : null}

        {!loading
          ? conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversation?.id}
                onSelect={onSelectConversation}
              />
            ))
          : null}
      </div>
    </aside>
  )
}

function MessageList({
  messages,
  loading,
  emptyMessage,
  messagesEndRef,
}: Pick<MessagePaneProps, 'messages' | 'loading' | 'emptyMessage' | 'messagesEndRef'>) {
  if (loading) {
    return <MessagesSkeleton />
  }

  if (messages.length === 0) {
    return (
      <EmptyPanel
        icon={Inbox}
        title="No messages yet"
        message={emptyMessage}
        guidance="Send the first reply to start the conversation."
      />
    )
  }

  return (
    <div className="space-y-5 p-4 md:p-6" aria-live="polite">
      {messages.map((message) => {
        const isSellerMessage = message.sender === 'SELLER'
        const deliveryLabel = message.deliveryStatus
          ? getDeliveryStatusLabel(message.deliveryStatus)
          : undefined

        return (
          <div
            key={message.id}
            className={`flex ${isSellerMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] space-y-1 sm:max-w-[72%] ${
                isSellerMessage ? 'items-end text-right' : 'items-start text-left'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-sm wrap-break-word whitespace-pre-wrap shadow-xs ${
                  isSellerMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border-border border'
                }`}
              >
                {message.content}
              </div>
              {(message.sentAtLabel || deliveryLabel) && (
                <div
                  className={`text-muted-foreground flex items-center gap-1 px-1 text-xs ${
                    isSellerMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sentAtLabel ? <span>{message.sentAtLabel}</span> : null}
                  {deliveryLabel && isSellerMessage ? (
                    <>
                      {message.deliveryStatus === 'READ' ? (
                        <CheckCheck className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Check className="size-3.5" aria-hidden="true" />
                      )}
                      <span>{deliveryLabel}</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

function MessageComposer({
  draftMessage,
  composerPlaceholder,
  sending,
  onDraftMessageChange,
  onSendMessage,
}: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
    textarea.style.overflowY = textarea.scrollHeight > 160 ? 'auto' : 'hidden'
  }, [draftMessage])

  return (
    <div className="bg-card border-border/80 border-t p-4">
      <div className="flex items-end gap-3">
        <Textarea
          ref={textareaRef}
          value={draftMessage}
          aria-label="Type your reply"
          onChange={(event) => {
            onDraftMessageChange(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void onSendMessage()
            }
          }}
          placeholder={composerPlaceholder}
          className="max-h-40 min-h-12 rounded-2xl"
          rows={1}
        />
        <Button
          type="button"
          size="icon-lg"
          aria-label={sending ? 'Sending message' : 'Send message'}
          className="rounded-2xl"
          onClick={() => void onSendMessage()}
          disabled={!draftMessage.trim() || sending}
          loading={sending}
        >
          {!sending ? <SendHorizontal className="size-4.5" /> : null}
        </Button>
      </div>
    </div>
  )
}

function MessagePane({
  selectedConversation,
  messages,
  loading,
  emptyMessage,
  unselectedMessage,
  composerPlaceholder,
  draftMessage,
  sending,
  isMobileDetailView,
  messagesEndRef,
  messagesScrollRef,
  onBackToList,
  onMessagesScroll,
  onDraftMessageChange,
  onSendMessage,
}: MessagePaneProps) {
  if (!selectedConversation) {
    return (
      <section className="bg-muted/20 flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden">
        <EmptyPanel
          icon={Inbox}
          title="No conversation selected"
          message={unselectedMessage}
          guidance="Pick a thread from the list to view messages and reply."
        />
      </section>
    )
  }

  return (
    <section className="bg-muted/20 flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-hidden">
      <header className="bg-card border-border/80 flex items-center gap-3 border-b px-4 py-3 md:px-5">
        {isMobileDetailView ? (
          <button
            type="button"
            aria-label="Back to conversations"
            onClick={onBackToList}
            className="text-muted-foreground hover:text-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="size-4.5" />
          </button>
        ) : null}

        <Avatar size="lg">
          {selectedConversation.buyerAvatarSrc ? (
            <AvatarImage
              src={selectedConversation.buyerAvatarSrc}
              alt={selectedConversation.buyerName}
            />
          ) : null}
          <AvatarFallback>{getConversationInitials(selectedConversation)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="text-foreground truncate font-semibold">
            {selectedConversation.buyerName}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            {selectedConversation.orderLabel ? (
              <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                <Package className="size-3.5" />
                {selectedConversation.orderLabel}
              </span>
            ) : null}
            {selectedConversation.productLabel ? (
              <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1">
                {selectedConversation.productLabel}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div
        ref={messagesScrollRef}
        className="min-h-0 flex-1 overflow-y-auto"
        onScroll={onMessagesScroll}
      >
        <MessageList
          messages={messages}
          loading={loading}
          emptyMessage={emptyMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <MessageComposer
        draftMessage={draftMessage}
        composerPlaceholder={composerPlaceholder}
        sending={sending}
        onDraftMessageChange={onDraftMessageChange}
        onSendMessage={onSendMessage}
      />
    </section>
  )
}

export function MessagesClient({
  conversations,
  messages,
  selectedConversationId,
  defaultSelectedConversationId = messagesDefaultProps.defaultSelectedConversationId,
  onSelectedConversationChange,
  search,
  onSearchChange,
  searchPlaceholder = messagesDefaultProps.searchPlaceholder,
  draftMessage,
  onDraftMessageChange,
  composerPlaceholder = messagesDefaultProps.composerPlaceholder,
  onSendMessage,
  loadingConversations = messagesDefaultProps.loadingConversations,
  loadingMessages = messagesDefaultProps.loadingMessages,
  emptyConversationsMessage = messagesDefaultProps.emptyConversationsMessage,
  emptyMessagesMessage = messagesDefaultProps.emptyMessagesMessage,
  unselectedConversationMessage = messagesDefaultProps.unselectedConversationMessage,
  filterConversations = filterMessageConversations,
}: MessagesClientProps) {
  const {
    currentDraftMessage,
    filteredConversations,
    handleBackToList,
    handleSelectConversation,
    handleSendMessage,
    messagesEndRef,
    messagesScrollRef,
    mobileView,
    searchInput,
    selectedConversation,
    sending,
    setCurrentDraftMessage,
    setSearchInput,
    shouldAutoScrollRef,
    updateAutoScrollState,
  } = useMessagesController({
    conversations,
    selectedConversationId,
    defaultSelectedConversationId,
    onSelectedConversationChange,
    search,
    onSearchChange,
    draftMessage,
    onDraftMessageChange,
    onSendMessage,
    filterConversations,
  })

  useEffect(() => {
    updateAutoScrollState()

    if (!shouldAutoScrollRef.current) {
      return
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <div className="bg-card border-border min-h-[60svh] w-full overflow-hidden rounded-lg border shadow-xs md:min-h-[68svh]">
      <div className="flex min-h-[60svh] w-full min-w-0 flex-col overflow-hidden md:min-h-[68svh] md:flex-row">
        <div className={mobileView === 'detail' ? 'hidden md:flex md:min-h-0 md:flex-col' : ''}>
          <ConversationSidebar
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            search={searchInput}
            searchPlaceholder={searchPlaceholder}
            loading={loadingConversations}
            emptyMessage={emptyConversationsMessage}
            onSearchChange={setSearchInput}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div className={mobileView === 'list' ? 'hidden min-h-0 flex-1 md:flex' : 'min-h-0 flex-1'}>
          <MessagePane
            selectedConversation={selectedConversation}
            messages={messages}
            loading={loadingMessages}
            emptyMessage={emptyMessagesMessage}
            unselectedMessage={unselectedConversationMessage}
            composerPlaceholder={composerPlaceholder}
            draftMessage={currentDraftMessage}
            sending={sending}
            isMobileDetailView={mobileView === 'detail'}
            messagesEndRef={messagesEndRef}
            messagesScrollRef={messagesScrollRef}
            onBackToList={handleBackToList}
            onMessagesScroll={updateAutoScrollState}
            onDraftMessageChange={setCurrentDraftMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
