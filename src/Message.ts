import type { MessageActionType, MessageAttachmentType } from './enums'
import type { TextAttributes } from './TextAttributes'
import type { Size } from './generic'
import type { Participant } from './User'

export type MessageReaction = {
  /** `id` should be `${participantID}${reactionKey}` if PlatformInfo.reactions.allowsMultipleReactionsToSingleMessage is true and just participantID otherwise */
  id: string
  /** this key can be three things: an emoji (😄), a key defined in PlatformInfo.reactions.supported, or a shortcode like `smiling-face` */
  reactionKey: string
  /** URL to the reaction's image */
  imgURL?: string
  participantID: string
  /** is the `reactionKey` an emoji */
  emoji?: boolean
}

export type ThreadTitleUpdatedAction = { type: MessageActionType.THREAD_TITLE_UPDATED, title: string, actorParticipantID: string }
export type ThreadParticipantsAddedAction = { type: MessageActionType.THREAD_PARTICIPANTS_ADDED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type ThreadParticipantsRemovedAction = { type: MessageActionType.THREAD_PARTICIPANTS_REMOVED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type GroupThreadCreatedAction = { type: MessageActionType.GROUP_THREAD_CREATED, title: string, actorParticipantID: string }
export type ThreadImgCreatedAction = { type: MessageActionType.THREAD_IMG_CHANGED, actorParticipantID: string }
export type MessageRequestAcceptedAction = { type: MessageActionType.MESSAGE_REQUEST_ACCEPTED }

export type MessageReactionCreatedAction = { type: MessageActionType.MESSAGE_REACTION_CREATED, messageID?: string } & Partial<MessageReaction>
export type MessageReactionDeletedAction = { type: MessageActionType.MESSAGE_REACTION_DELETED, messageID?: string } & Partial<MessageReaction>

export type MessageAction =
  ThreadTitleUpdatedAction |
  ThreadParticipantsAddedAction |
  ThreadParticipantsRemovedAction |
  GroupThreadCreatedAction |
  ThreadImgCreatedAction |
  MessageRequestAcceptedAction |
  MessageReactionCreatedAction |
  MessageReactionDeletedAction

export type MessageSeen =
  boolean | Date | // for single threads
  { [participantID: string]: Date } // for group threads

export type MessagePreview = Pick<Message, 'id' | 'threadID' | 'text' | 'senderID' | 'attachments'>

export type MessageAttachment = {
  id: string
  type: MessageAttachmentType
  isGif?: boolean
  isSticker?: boolean
  isVoiceNote?: boolean
  size?: Size
  srcURL?: string
  data?: Buffer
  posterImg?: Buffer | string
  mimeType?: string
  fileName?: string
  fileSize?: number
  loading?: boolean
  caption?: string
  extra?: any
}

export type Tweet = {
  id: string
  user: {
    imgURL: string
    name: string
    username: string
  }
  timestamp?: Date
  url: string
  text: string
  textAttributes?: TextAttributes
  attachments?: MessageAttachment[]
  quotedTweet?: Tweet
}

export type MessageLink = {
  url: string
  /**
   * if the url is shortened or behind a redirector (like t.co or l.messenger.com) and we have the original url
   */
  originalURL?: string
  favicon?: string
  img?: string
  imgSize?: Size
  title: string
  summary?: string
}

export type MessageButton = {
  label: string
  linkURL: string
}

export type Message = {
  _original?: string
  id: string
  timestamp: Date
  editedTimestamp?: Date
  expiresInSeconds?: number
  forwardedCount?: number
  senderID: 'none' | '$thread' | string

  text: string
  textAttributes?: TextAttributes
  textHeading?: string
  textFooter?: string

  attachments?: MessageAttachment[]
  /** @deprecated */
  tweet?: Tweet
  tweets?: Tweet[]
  links?: MessageLink[]
  iframeURL?: string

  reactions?: MessageReaction[]
  seen?: MessageSeen
  isDelivered?: boolean
  isHidden?: boolean
  /** `isSender` should be true if the logged in user sent the message */
  isSender: boolean
  isAction?: boolean
  isDeleted?: boolean
  isErrored?: boolean
  isDynamicMessage?: boolean
  parseTemplate?: boolean
  /** `silent` messages will not mark the thread as unread, move the thread to the top of the list, or show a notification */
  silent?: boolean
  /** thread ID of the quoted message, should be null if same thread as this message */
  linkedMessageThreadID?: string
  /** message ID of the quoted message. also set `linkedMessageThreadID` if message belongs to a different thread */
  linkedMessageID?: string
  linkedMessage?: MessagePreview
  action?: MessageAction
  cursor?: string
  buttons?: MessageButton[]

  extra?: any

  accountID?: string
  threadID?: string
  // sender?: Participant
  sortKey?: string | number
}
