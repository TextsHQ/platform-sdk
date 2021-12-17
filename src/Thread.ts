import type { Paginated } from './generic'
import type { Message } from './Message'
import type { Participant } from './User'
import type { ThreadFolderName } from './ThreadFolderName'

export type ThreadType = 'single' | 'group' | 'channel' | 'broadcast'

export type Thread = {
  _original?: string

  folderName?: ThreadFolderName

  id: string
  /** Title of the thread if manually set by a human. If not present, the client will auto infer this for both single and group threads */
  title?: string
  isUnread: boolean
  /** ID of the last message that the current user has read */
  lastReadMessageID?: string
  /** If true, messages cannot be sent in the thread */
  isReadOnly: boolean
  isArchived?: boolean
  isPinned?: boolean
  mutedUntil?: Date | 'forever'

  type: ThreadType
  timestamp?: Date

  imgURL?: string
  createdAt?: Date
  description?: string
  /** If Thread.messages is empty, use `lastMessageSnippet` to set the last message preview */
  lastMessageSnippet?: string
  messageExpirySeconds?: number

  messages: Paginated<Message>
  participants: Paginated<Participant>

  /** Any arbitrary data */
  extra?: any
}
