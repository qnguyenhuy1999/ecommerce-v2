'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useControllableState } from '../../hooks'
import type { MessageConversation, MessagesProps } from './Messages.types'

interface UseMessagesControllerParams {
  conversations: MessageConversation[]
  selectedConversationId?: MessagesProps['selectedConversationId']
  defaultSelectedConversationId?: MessagesProps['defaultSelectedConversationId']
  onSelectedConversationChange?: MessagesProps['onSelectedConversationChange']
  search?: MessagesProps['search']
  onSearchChange?: MessagesProps['onSearchChange']
  draftMessage?: MessagesProps['draftMessage']
  onDraftMessageChange?: MessagesProps['onDraftMessageChange']
  onSendMessage?: MessagesProps['onSendMessage']
  filterConversations: NonNullable<MessagesProps['filterConversations']>
}

export function useMessagesController({
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
}: UseMessagesControllerParams) {
  const [currentSearch, setCurrentSearch] = useControllableState({
    defaultValue: search ?? '',
    ...(search !== undefined ? { value: search } : {}),
    ...(onSearchChange !== undefined ? { onChange: onSearchChange } : {}),
  })
  const [searchInput, setSearchInput] = useState(search ?? '')
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
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)

  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchInput !== currentSearch) {
        setCurrentSearch(searchInput)
      }
    }, 250)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [currentSearch, searchInput, setCurrentSearch])

  const sortedConversations = useMemo(() => getSortedConversations(conversations), [conversations])
  const filteredConversations = useMemo(
    () => filterConversations({ conversations: sortedConversations, search: currentSearch }),
    [currentSearch, filterConversations, sortedConversations],
  )
  const selectedConversation = useMemo(
    () =>
      filteredConversations.find(
        (conversation) => conversation.id === currentSelectedConversationId,
      ) ??
      sortedConversations.find((conversation) => conversation.id === currentSelectedConversationId),
    [currentSelectedConversationId, filteredConversations, sortedConversations],
  )

  useEffect(() => {
    if (selectedConversation) {
      return
    }

    const nextConversationId = filteredConversations[0]?.id ?? sortedConversations[0]?.id

    if (nextConversationId) {
      setCurrentSelectedConversationId(nextConversationId)
    }
  }, [
    filteredConversations,
    selectedConversation,
    setCurrentSelectedConversationId,
    sortedConversations,
  ])

  const updateAutoScrollState = () => {
    const container = messagesScrollRef.current

    if (!container) {
      return
    }

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight

    shouldAutoScrollRef.current = distanceFromBottom < 96
  }

  useEffect(() => {
    shouldAutoScrollRef.current = true
  }, [currentSelectedConversationId])

  const handleSelectConversation = (conversationId: string) => {
    setCurrentSelectedConversationId(conversationId)
    setMobileView('detail')
  }

  const handleBackToList = () => {
    setMobileView('list')
  }

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
      shouldAutoScrollRef.current = true
    } finally {
      setSending(false)
    }
  }

  return {
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
  }
}

function getSortedConversations(conversations: MessageConversation[]) {
  return [...conversations]
    .map((conversation, index) => ({ conversation, index }))
    .sort((left, right) => {
      const leftTime = left.conversation.lastActivityAt
        ? new Date(left.conversation.lastActivityAt).getTime()
        : 0
      const rightTime = right.conversation.lastActivityAt
        ? new Date(right.conversation.lastActivityAt).getTime()
        : 0

      if (leftTime === rightTime) {
        return left.index - right.index
      }

      return rightTime - leftTime
    })
    .map(({ conversation }) => conversation)
}
