import type React from 'react'
import { ThreadActionType, MessageAttachmentType, MessageDeletionMode, Attribute, CodeRequiredReason, InboxName, ServerEventType, ConnectionStatus } from './enums'
import { EventEmitter } from 'events'

export type Awaitable<T> = T | PromiseLike<T>

export type Size = {
  width: number
  height: number
}

export type Paginated<T> = {
  items: T[]
  hasMore: boolean
  oldestCursor?: string
  newestCursor?: string
}

export type ThreadTitleUpdated = { type: ThreadActionType.THREAD_TITLE_UPDATED, title: string, actorParticipantID: string }
export type ThreadParticipantsAdded = { type: ThreadActionType.THREAD_PARTICIPANTS_ADDED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type ThreadParticipantsRemoved = { type: ThreadActionType.THREAD_PARTICIPANTS_REMOVED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type GroupThreadCreated = { type: ThreadActionType.GROUP_THREAD_CREATED, title: string, actorParticipantID: string }
export type MessageRequestAccepted = { type: ThreadActionType.MESSAGE_REQUEST_ACCEPTED }

export type Action =
  ThreadTitleUpdated |
  ThreadParticipantsAdded |
  ThreadParticipantsRemoved |
  GroupThreadCreated |
  MessageRequestAccepted

export type MessageSeen = boolean | Date | { [participantID: string]: Date | boolean }

export type CurrentUser = {
  id: string
  name?: string
  displayText: string
  imgURL?: string
  isVerified?: boolean
}

export type LoginMode = 'browser' | 'manual' | 'custom'

export type LoginResult = {
  type: 'success' | 'code_required' | 'error'
  reason?: CodeRequiredReason
  metadata?: any
  title?: string
  errorMessage?: string
}

export type BrowserLogin = {
  loginURL: string
  authCookieName: string
}

export type MessageAttachment = {
  id: string
  type: MessageAttachmentType
  isGif?: boolean
  size?: Size
  srcURL?: string
  data?: Buffer
  posterImg?: Buffer
  mimeType?: string
  fileName?: string
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
  attachments: MessageAttachment[]
  quotedTweet?: Tweet
}

export type Participant = {
  id: string
  username?: string
  phoneNumber?: string
  email?: string
  fullName?: string
  nickname?: string
  imgURL?: string
  isVerified?: boolean
  isAdmin?: boolean
  isSelf?: boolean
  hasExited?: boolean
  cannotMessage?: boolean
}

export type MessagePreview = {
  id: string
  text: string
  senderID: string
}

export type MessageReaction = {
  reactionName: string
  participantID: string
}

export type MessageLink = {
  url: string
  favicon?: string
  img?: string
  title: string
  summary?: string
}

export type Message = {
  id: string
  textHeading?: string
  textFooter?: string
  text: string
  timestamp: Date
  senderID: 'none' | string

  attachments: MessageAttachment[]
  tweet?: Tweet
  link?: MessageLink
  iframeURL?: string

  reactions: MessageReaction[]
  seen?: MessageSeen
  isDelivered?: boolean
  isHidden?: boolean
  isSender: boolean
  isAction?: boolean
  isDeleted?: boolean
  isErrored?: boolean
  isDynamicMessage?: boolean
  parseTemplate?: boolean
  cursor?: string
  linkedMessageID?: string
  linkedMessage?: MessagePreview
  action?: Action

  extra?: any

  threadID?: string
  sender?: Participant
}

export type ThreadUpdatedEvent = {
  type: ServerEventType.THREAD_UPDATED
  threadID: string
}

export type ThreadReadEvent = {
  type: ServerEventType.THREAD_READ
  threadID: string
}

export type ParticipantTypingEvent = {
  type: ServerEventType.PARTICIPANT_TYPING
  threadID: string
  participantID: string
  durationMs: number
}

export type ParticipantStoppedTypingEvent = {
  type: ServerEventType.PARTICIPANT_STOPPED_TYPING
  threadID: string
  participantID: string
}

export type ServerEvent =
  ThreadUpdatedEvent |
  ThreadReadEvent |
  ParticipantTypingEvent |
  ParticipantStoppedTypingEvent

export type OnServerEventCallback = (event: ServerEvent[]) => void

export type OnConnStateChangeCallback = (state: ConnectionState) => void

export type ThreadType = 'single' | 'group' | 'broadcast'

export type Thread = {
  id: string
  title?: string
  isUnread: boolean
  isReadOnly: boolean
  isArchived?: boolean
  messages: Message[]
  type: ThreadType
  participants: Participant[]
  timestamp: Date
  imgURL?: string
  createdAt?: Date
  description?: string
}
export type ConnectionState = {
  status: ConnectionStatus
}
export type MessageFileContent = {
  file: {filePath?: string, buffer?: Buffer} 
  mimeType: string
  fileName: string
}
export type MessageSendContent = {
  text?: string
  file?: MessageFileContent
  quotedMessageID?: string
}
export type Reaction = {
  title: string
  render: string
}

export interface PlatformAPI<MyCredsType, MyThreadType, MyMessageType, MyContactType> {
  /** Dispose of all used assets & close the session */
  dispose: () => Awaitable<void>
  /**
   * Login to the platform
   * @param accountID unique string identifying the platform account in Texts
   * @param ev EventEmiiter where all events must be called
   * @param session Credentials that may be used to log in
   */
  login: (accountID: string, ev: EventEmitter, session?: MyCredsType) => Awaitable<void>
  /** Log out of the account */
  logout?: () => Awaitable<void>
  /** Return the credentials to log back in */
  serializeSession?: () => Awaitable<MyCredsType>
  /** Takeover the session here */
  takeover?: () => Awaitable<void>
  /** Get the current user's info */
  userGetCurrent: () => Awaitable<CurrentUser>
  /** Get the user for the given ID */
  userGet: (id: string) => Promise<MyContactType | null>
  /** Look up users */
  userSearch: (typed: string) => Promise<MyContactType[]>
  /** 
   * Look for messages in the user's inboxes
   * @param typed the typed string
   * @param beforeCursor optional cursor after which to return more results
   * @param threadID optionally, the thread to look for messages in
  */
  messageSearch?: (typed: string, beforeCursor?: string, threadID?: string) => Promise<Paginated<MyMessageType>>
  /** Get the specified message in the given thread */
  messageGet: (threadID: string, messageID: string) => Promise<MyMessageType | null>
  messageGets: (threadID: string, beforeCursor?: string) => Promise<Paginated<MyMessageType>>
  /** Send a message to the given thread */
  messageSend: (threadID: string, content: MessageSendContent) => Promise<void>
  /** Delete the given message in the given thread */
  messageDelete?: (threadID: string, messageID: string, forEveryone?: boolean) => Promise<void>
  messageAddReaction?: (threadID: string, messageID: string, reactionName: string) => Promise<void>
  messageRemoveReaction?: (threadID: string, messageID: string, reactionName: string) => Promise<void>
  /** Mark the given message as read */
  messageRead: (threadID: string, messageID: string) => Promise<void>
  /** Create a thread with the given users & title */
  threadCreate: (userIDs: string[], title?: string) => Promise<MyThreadType>
  /** Return the thread for the given ID */
  threadGet: (threadID: string) => Promise<MyThreadType | null>
  /** Return the threads in the specified inbox */
  threadGets: (inboxName: InboxName, beforeCursor?: string) => Promise<Paginated<MyThreadType>>
  threadChangeTitle?: (threadID: string, newTitle: string) => Promise<void>
  threadMarkUnread?: (threadID: string) => Awaitable<void>
  threadArchive?: (threadID: string, archived: boolean) => Awaitable<void>
  threadMute?: (threadID: string, muted: boolean) => Awaitable<void>
  threadPin?: (threadID: string, pinned: boolean) => Awaitable<void>
  threadAddParticipant?: (threadID: string, participantID: string) => Promise<void>
  threadRemoveParticipant?: (threadID: string, participantID: string) => Promise<void>
  threadModifyParticipantRole?: (threadID: string, participantID: string, role: string) => Promise<void>
  threadOnSelected?: (threadID: string) => Awaitable<void>

  sendTypingIndicator?: (threadID: string, typing?: boolean) => Awaitable<void>  
}
export type ReactObject = React.ReactElement | (() => JSX.Element) | ((props: any) => JSX.Element)
export type PlatformMetadata = {
  name: string
  version: string
  displayName: string
  supportedReactions: Record<string, Reaction>
  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>
  icon: ReactObject

  loginMode: LoginMode
  browserLogin?: BrowserLogin
  auth?: any

  maxGroupTitleLength?: number
  typingDurationMs?: number

  getUserLink: (participant: Participant) => string
}