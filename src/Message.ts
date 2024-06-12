import type { MessageActionType, MessageBehavior } from './enums'
import type { TextAttributes } from './TextAttributes'
import type { ThreadID } from './Thread'
import type { Participant, UserID } from './User'
import type { Attachment } from './Attachment'
import type { Identifiable, Size, ID, ExtraProp, OriginalProp, Button, CursorProp } from './generic'

export type MessageID = ID

export interface MessageReaction extends Identifiable {
  /** `id` should be `${participantID}${reactionKey}` if PlatformInfo.reactions.allowsMultipleReactionsToSingleMessage is true and just participantID otherwise */
  id: ID
  /** this key can be three things: an emoji (😄), a key defined in PlatformInfo.reactions.supported, or a shortcode like `smiling-face` */
  reactionKey: string
  /** URL to the reaction's image */
  imgURL?: string
  participantID: UserID
  /** is the `reactionKey` an emoji */
  emoji?: boolean
  messageID?: string
}

export type ThreadTitleUpdatedAction = { type: MessageActionType.THREAD_TITLE_UPDATED, title: string, actorParticipantID: UserID }
export type ThreadParticipantsAddedAction = { type: MessageActionType.THREAD_PARTICIPANTS_ADDED, participantIDs: UserID[], actorParticipantID: UserID, participants?: Participant[] }
export type ThreadParticipantsRemovedAction = { type: MessageActionType.THREAD_PARTICIPANTS_REMOVED, participantIDs: UserID[], actorParticipantID: UserID, participants?: Participant[] }
export type GroupThreadCreatedAction = { type: MessageActionType.GROUP_THREAD_CREATED, title: string, actorParticipantID: UserID }
export type ThreadImgChangedAction = { type: MessageActionType.THREAD_IMG_CHANGED, actorParticipantID: UserID }
export type MessageRequestAcceptedAction = { type: MessageActionType.MESSAGE_REQUEST_ACCEPTED }

export type MessageReactionCreatedAction = { type: MessageActionType.MESSAGE_REACTION_CREATED, messageID?: MessageID } & Partial<MessageReaction>
export type MessageReactionDeletedAction = { type: MessageActionType.MESSAGE_REACTION_DELETED, messageID?: MessageID } & Partial<MessageReaction>

export type MessageAction =
  ThreadTitleUpdatedAction |
  ThreadParticipantsAddedAction |
  ThreadParticipantsRemovedAction |
  GroupThreadCreatedAction |
  ThreadImgChangedAction |
  MessageRequestAcceptedAction |
  MessageReactionCreatedAction |
  MessageReactionDeletedAction

export type MessageSeen =
  boolean | Date | // for single threads
  { [participantID: string]: boolean | Date } // for group threads

export type MessagePreview = Pick<Message, 'id' | 'threadID' | 'text' | 'senderID' | 'attachments'>

export interface Tweet extends Identifiable {
  id: string
  user: {
    imgURL: string
    name: string
    username: string
    isVerified?: boolean
  }
  text: string
  timestamp?: Date
  url?: string
  textAttributes?: TextAttributes
  attachments?: Attachment[]
  quotedTweet?: Tweet
}

export type MessageLink = {
  url: string
  /**
   * originalURL should be set if the url is shortened or behind a redirector (like t.co or l.messenger.com) and we have the original url
   */
  originalURL?: string
  favicon?: string
  img?: string
  imgSize?: Size
  title: string
  summary?: string
}

export type MessageButton = Button

export interface Message extends Identifiable, ExtraProp, OriginalProp, CursorProp {
  id: MessageID
  timestamp: Date
  editedTimestamp?: Date
  expiresInSeconds?: number
  forwardedCount?: number
  forwardedFrom?: { text?: string } & ({ threadID: ThreadID } | { userID: UserID })
  senderID: 'none' | '$thread' | string

  text?: string
  textAttributes?: TextAttributes
  textHeading?: string
  textFooter?: string

  attachments?: Attachment[]
  tweets?: Tweet[]
  links?: MessageLink[]
  iframeURL?: string

  reactions?: MessageReaction[]
  seen?: MessageSeen
  isDelivered?: boolean
  isHidden?: boolean
  /** `isSender` should be true if the logged in user sent the message, default = false */
  isSender?: boolean
  isAction?: boolean
  isDeleted?: boolean
  isErrored?: boolean
  parseTemplate?: boolean
  /** thread ID of the quoted message, should be null if same thread as this message */
  linkedMessageThreadID?: ThreadID
  /** message ID of the quoted message. also set `linkedMessageThreadID` if message belongs to a different thread */
  linkedMessageID?: MessageID
  linkedMessage?: MessagePreview
  action?: MessageAction
  buttons?: MessageButton[]

  behavior?: MessageBehavior

  accountID?: string
  threadID?: ThreadID

  sortKey?: string | number
}
