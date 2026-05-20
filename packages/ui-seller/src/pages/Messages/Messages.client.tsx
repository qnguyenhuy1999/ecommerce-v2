'use client'

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Input, Textarea } from '@ecom/core-ui'
import { Search, SendHorizontal } from 'lucide-react'
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useControllableState } from '../../hooks'
import { messagesDefaultProps } from './Messages.fixtures'
import type { MessageConversation, MessageEntry, MessagesProps } from './Messages.types'
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
            <div className="bg-muted h-11 w-56 animate-pulse rounded-[20px]" />
            <div className="bg-muted h-3 w-16 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground flex min-h-[18rem] items-center justify-center px-6 text-center text-sm">
      {message}
    </div>
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
  const [currentSearch, setCurrentSearch] = useControllableState({
    defaultValue: search ?? '',
    ...(search !== undefined ? { value: search } : {}),
    ...(onSearchChange !== undefined ? { onChange: onSearchChange } : {}),
  })
  const [currentSelectedConversationId, setCurrentSelectedConversationId] = useControllableState({
    defaultValue: defaultSelectedConversationId ?? conversations[0]?.id ?? '',
    ...(selectedConversationId !== undefined ? { value: selectedConversationId } : {}),
    ...(onSelectedConversationChange !== undefined
      ? { onChange: onSelectedConversationChange }
      : {}),
  })
  const [currentDraftMessage, setCurrentDraftMessage] = useControllableState({
    defaultValue: draftMessage ?? '',
    ...(draftMessage !== undefined ? { value: draftMessage } : {}),
    ...(onDraftMessageChange !== undefined ? { onChange: onDraftMessageChange } : {}),
  })
  const [sending, setSending] = useState(false)
  const deferredSearch = useDeferredValue(currentSearch)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredConversations = useMemo(
    () => filterConversations({ conversations, search: deferredSearch }),
    [conversations, deferredSearch, filterConversations],
  )
  const selectedConversation = useMemo(
    () =>
      filteredConversations.find((conversation) => conversation.id === currentSelectedConversationId) ??
      conversations.find((conversation) => conversation.id === currentSelectedConversationId),
    [conversations, currentSelectedConversationId, filteredConversations],
  )

  useEffect(() => {
    if (selectedConversation) {
      return
    }

    const nextConversationId = filteredConversations[0]?.id ?? conversations[0]?.id

    if (nextConversationId) {
      setCurrentSelectedConversationId(nextConversationId)
    }
  }, [conversations, filteredConversations, selectedConversation, setCurrentSelectedConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!selectedConversation || !currentDraftMessage.trim() || sending) {
      return
    }

    if (!onSendMessage) {
      setCurrentDraftMessage('')
      return
    }

    setSending(true)

    try {
      await Promise.resolve(onSendMessage(selectedConversation, currentDraftMessage.trim()))
      setCurrentDraftMessage('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-card border-border min-h-[42rem] overflow-hidden rounded-[28px] border shadow-xs">
      <div className="grid min-h-[42rem] md:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="border-border/80 flex min-h-0 flex-col border-b md:border-r md:border-b-0">
          <div className="border-border/80 border-b p-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <Input
                value={currentSearch}
                onChange={(event) => {
                  const value = event.target.value
                  startTransition(() => {
                    setCurrentSearch(value)
                  })
                }}
                placeholder={searchPlaceholder}
                className="h-11 rounded-2xl pl-11"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loadingConversations ? <ConversationListSkeleton /> : null}

            {!loadingConversations && filteredConversations.length === 0 ? (
              <EmptyPanel message={emptyConversationsMessage} />
            ) : null}

            {!loadingConversations
              ? filteredConversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversation?.id

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => {
                        startTransition(() => {
                          setCurrentSelectedConversationId(conversation.id)
                        })
                      }}
                      className={`border-border/80 hover:bg-muted/50 flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-muted/60' : 'bg-transparent'
                      }`}
                    >
                      <Avatar size="lg" className="mt-0.5">
                        {conversation.buyerAvatarSrc ? (
                          <AvatarImage src={conversation.buyerAvatarSrc} alt={conversation.buyerName} />
                        ) : null}
                        <AvatarFallback>{getConversationInitials(conversation)}</AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-foreground truncate text-base font-semibold">
                              {conversation.buyerName}
                            </div>
                            {conversation.orderLabel ? (
                              <div className="text-muted-foreground truncate text-sm">
                                {conversation.orderLabel}
                              </div>
                            ) : null}
                          </div>

                          {conversation.unreadCount ? (
                            <Badge className="rounded-full px-2 py-0.5 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          ) : null}
                        </div>

                        {conversation.lastMessagePreview ? (
                          <p className="text-muted-foreground mt-1 truncate text-sm">
                            {conversation.lastMessagePreview}
                          </p>
                        ) : null}

                        {conversation.lastMessageAtLabel ? (
                          <p className="text-muted-foreground/80 mt-1 text-xs">
                            {conversation.lastMessageAtLabel}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  )
                })
              : null}
          </div>
        </aside>

        <section className="bg-muted/20 flex min-h-0 flex-col">
          {selectedConversation ? (
            <>
              <header className="bg-card border-border/80 flex items-center gap-3 border-b px-4 py-3 md:px-5">
                <Avatar size="lg">
                  {selectedConversation.buyerAvatarSrc ? (
                    <AvatarImage
                      src={selectedConversation.buyerAvatarSrc}
                      alt={selectedConversation.buyerName}
                    />
                  ) : null}
                  <AvatarFallback>{getConversationInitials(selectedConversation)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="text-foreground truncate font-semibold">
                    {selectedConversation.buyerName}
                  </div>
                  {selectedConversation.orderLabel ? (
                    <div className="text-muted-foreground truncate text-sm">
                      {selectedConversation.orderLabel}
                    </div>
                  ) : null}
                </div>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {loadingMessages ? <MessagesSkeleton /> : null}

                {!loadingMessages && messages.length === 0 ? (
                  <EmptyPanel message={emptyMessagesMessage} />
                ) : null}

                {!loadingMessages ? (
                  <div className="space-y-5 p-4 md:p-6">
                    {messages.map((message) => {
                      const isSellerMessage = message.sender === 'SELLER'

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isSellerMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] space-y-1 sm:max-w-[70%] ${
                              isSellerMessage ? 'items-end text-right' : 'items-start text-left'
                            }`}
                          >
                            <div
                              className={`rounded-[20px] px-4 py-3 text-sm shadow-xs ${
                                isSellerMessage
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-card text-foreground border-border border'
                              }`}
                            >
                              {message.content}
                            </div>
                            {message.sentAtLabel ? (
                              <div className="text-muted-foreground px-1 text-xs">
                                {message.sentAtLabel}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : null}
              </div>

              <div className="bg-card border-border/80 border-t p-4">
                <div className="flex items-end gap-3">
                  <Textarea
                    value={currentDraftMessage}
                    onChange={(event) => {
                      const value = event.target.value
                      startTransition(() => {
                        setCurrentDraftMessage(value)
                      })
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        void handleSendMessage()
                      }
                    }}
                    placeholder={composerPlaceholder}
                    className="min-h-12 rounded-2xl"
                    rows={1}
                  />
                  <Button
                    type="button"
                    size="icon-lg"
                    className="rounded-2xl"
                    onClick={() => void handleSendMessage()}
                    disabled={!currentDraftMessage.trim()}
                    loading={sending}
                  >
                    {!sending ? <SendHorizontal className="size-4.5" /> : null}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyPanel message={unselectedConversationMessage} />
          )}
        </section>
      </div>
    </div>
  )
}
