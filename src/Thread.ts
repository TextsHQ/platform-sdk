import type { Paginated } from './generic'
import type { Message } from './Message'
import type { Participant } from './User'

export type ThreadType = 'single' | 'group' | 'broadcast'

export type Thread = {
  _original?: string

  id: string
  cursor?: string
  title?: string
  isUnread: boolean
  isReadOnly: boolean
  isArchived?: boolean
  isPinned?: boolean
  mutedUntil?: Date | 'forever'

  type: ThreadType
  timestamp?: Date

  imgURL?: string
  createdAt?: Date
  description?: string
  /** if messages haven't been fetched, use `lastMessageSnippet` to set the last message preview */
  lastMessageSnippet?: string
  messageExpirySeconds?: number

  messages: Paginated<Message>
  participants: Paginated<Participant>
}
