import type { CookieJar } from 'tough-cookie'
import type React from 'react'
import { ThreadActionType, MessageAttachmentType, MessageDeletionMode, Attribute, CodeRequiredReason, InboxName, ServerEventType, ConnectionStatus } from './enums'

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

export type User = {
  id: string
  username?: string
  phoneNumber?: string
  email?: string
  fullName?: string
  nickname?: string
  imgURL?: string
  isVerified?: boolean
  cannotMessage?: boolean
  isSelf?: boolean
}

export type CurrentUser = User & {
  displayText: string
}

export type Participant = User & {
  isAdmin?: boolean
  hasExited?: boolean
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
  _original: any
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
  _original?: any
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

export type MessageSendOptions = {
  quotedMessageID?: string
}

export type LoginCreds = {
  cookieJarJSON?: CookieJar.Serialized
  username?: string
  password?: string
  code?: string
  lastLoginResult?: LoginResult
}

// also modify relayer-constants.ts
export interface PlatformAPI {
  init: (session?: any, accountID?: string) => Awaitable<void>
  dispose: () => Awaitable<void>

  getCurrentUser: () => Awaitable<CurrentUser>

  login?: (creds?: LoginCreds) => Awaitable<LoginResult>
  logout?: () => Awaitable<void>
  serializeSession?: () => Awaitable<any>

  subscribeToEvents: (onEvent: OnServerEventCallback) => Awaitable<void>
  unsubscribeToEvents: () => Awaitable<void>
  onLoginEvent?: (onEvent: Function) => Awaitable<void>
  onConnectionStateChange?: (onEvent: OnConnStateChangeCallback) => Awaitable<void>

  takeoverConflict?: () => Awaitable<void>

  searchUsers: (typed: string) => Awaitable<Participant[]>
  searchMessages?: (typed: string, beforeCursor?: string, threadID?: string) => Awaitable<Paginated<Message>>

  getThreads: (inboxName: InboxName, beforeCursor?: string) => Awaitable<Paginated<Thread>>
  getMessages: (threadID: string, beforeCursor: string) => Awaitable<Paginated<Message>>
  createThread: (userIDs: string[], title?: string) => Awaitable<boolean | Thread>

  // sendMessage?: (threadID: string, content: { text?: string, filePaths?: string }) => Awaitable<boolean>
  sendTextMessage: (threadID: string, text: string, options?: MessageSendOptions) => Promise<boolean>
  sendFileFromFilePath: (threadID: string, filePath: string, mimeType: string, options?: MessageSendOptions) => Promise<boolean>
  sendFileFromBuffer: (threadID: string, fileBuffer: Buffer, mimeType: string, fileName?: string, options?: MessageSendOptions) => Promise<boolean>

  sendTypingIndicator: (threadID: string, typing?: boolean) => Awaitable<void>
  addReaction?: (threadID: string, messageID: string, reactionName: string) => Awaitable<any>
  removeReaction?: (threadID: string, messageID: string, reactionName: string) => Awaitable<any>
  deleteMessage?: (threadID: string, messageID: string, forEveryone?: boolean) => Awaitable<boolean>
  sendReadReceipt: (threadID: string, messageID: string, messageCursor?: string) => Awaitable<any>

  addParticipant?: (threadID: string, participantID: string) => Awaitable<boolean>
  removeParticipant?: (threadID: string, participantID: string) => Awaitable<boolean>
  changeParticipantRole?: (threadID: string, participantID: string, role: string) => Awaitable<boolean>

  changeThreadTitle?: (threadID: string, newTitle: string) => Awaitable<boolean>
  changeThreadImage?: (threadID: string, imageBuffer: Buffer, mimeType: string) => Awaitable<void>

  markAsUnread?: (threadID: string) => Awaitable<void>
  archiveThread?: (threadID: string, archived: boolean) => Awaitable<void>
  muteThread?: (threadID: string, muted: boolean) => Awaitable<void>
  pinThread?: (threadID: string, pinned: boolean) => Awaitable<void>

  onThreadSelected?: (threadID: string) => Awaitable<void>
  loadDynamicMessage?: (message: Message) => Awaitable<Message>
}

export type Reaction = {
  title: string
  render: string
}

export type Platform = {
  name: string
  version: string
  displayName: string
  supportedReactions: Record<string, Reaction>
  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>
  icon: React.ReactElement | (() => JSX.Element) | ((props: any) => JSX.Element)

  loginMode: LoginMode
  browserLogin?: BrowserLogin
  auth?: any

  maxGroupTitleLength?: number
  typingDurationMs?: number

  getUserLink: (participant: Participant) => string

  mapMessage?: (...originalMsg: any) => Message
}
