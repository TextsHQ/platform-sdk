import type { ExtraProp, ID, Identifiable, OriginalProp, Paginated } from './generic'
import type { Message, MessageID } from './Message'
import type { Participant } from './User'
import type { ThreadFolderName } from './ThreadFolderName'

export type ThreadType = 'single' | 'group' | 'channel' | 'broadcast'

export type ThreadID = ID

export type PartialLastMessage = Partial<Pick<Message, 'id' | 'text' | 'isSender' | 'senderID'>>

export interface Thread extends Identifiable, ExtraProp, OriginalProp {
  folderName?: ThreadFolderName

  id: ThreadID
  /** Title of the thread if manually set by a human. If not present, the client will auto infer this for both single and group threads */
  title?: string
  isUnread: boolean
  /** ID of the last message that the current user has read */
  lastReadMessageID?: MessageID
  /** If true, messages cannot be sent in the thread */
  isReadOnly: boolean
  isArchived?: boolean
  isPinned?: boolean
  mutedUntil?: Date | 'forever'

  type: ThreadType
  /** If null, thread won't be visible to the user in the UI unless they explicitly search for it  */
  timestamp?: Date

  imgURL?: string
  createdAt?: Date
  description?: string
  /** If Thread.messages is empty, use `lastMessage` to set the last message preview */
  partialLastMessage?: PartialLastMessage
  messageExpirySeconds?: number

  messages: Paginated<Message>
  participants: Paginated<Participant>

  isE2EE?: boolean;
}
