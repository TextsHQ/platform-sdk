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

export type ThreadTitleUpdatedAction = { type: ThreadActionType.THREAD_TITLE_UPDATED, title: string, actorParticipantID: string }
export type ThreadParticipantsAddedAction = { type: ThreadActionType.THREAD_PARTICIPANTS_ADDED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type ThreadParticipantsRemovedAction = { type: ThreadActionType.THREAD_PARTICIPANTS_REMOVED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type GroupThreadCreatedAction = { type: ThreadActionType.GROUP_THREAD_CREATED, title: string, actorParticipantID: string }
export type MessageRequestAcceptedAction = { type: ThreadActionType.MESSAGE_REQUEST_ACCEPTED }

export type Action =
  ThreadTitleUpdatedAction |
  ThreadParticipantsAddedAction |
  ThreadParticipantsRemovedAction |
  GroupThreadCreatedAction |
  MessageRequestAcceptedAction

export type MessageSeen =
  boolean | Date | // for single threads
  { [participantID: string]: Date | boolean } // for group threads

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
  authCookieName?: string
  runJSOnLaunch?: string
  runJSOnClose?: string
  windowWidth?: number
  windowHeight?: number
}

export type MessageAttachment = {
  id: string
  type: MessageAttachmentType
  isGif?: boolean
  size?: Size
  srcURL?: string
  data?: Buffer
  posterImg?: Buffer | string
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
  imgSize?: Size
  title: string
  summary?: string
}

export type Message = {
  _original: any[]
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
  shouldNotify?: boolean
  linkedMessageID?: string
  linkedMessage?: MessagePreview
  action?: Action

  extra?: any

  threadID?: string
  sender?: Participant
}

export type UserPresence = {
  userID: string
  isActive: boolean
  lastActive: Date
}

export type ThreadMessagesUpdatedEvent = {
  type: ServerEventType.THREAD_MESSAGES_UPDATED
  threadID: string
}

export type ThreadMessagesAddedEvent = {
  type: ServerEventType.THREAD_MESSAGES_ADDED
  threadID: string
  messages: Message[]
}

export type ThreadDeletedEvent = {
  type: ServerEventType.THREAD_DELETED
  threadID: string
}

export type ThreadPropsUpdatedEvent = {
  type: ServerEventType.THREAD_PROPS_UPDATED
  threadID: string
  props: Omit<Partial<Thread>, '_original' | 'id' | 'type' | 'messages'>
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

export type UserPresenceEvent = {
  type: ServerEventType.USER_PRESENCE_UPDATED
  presence: UserPresence
}

// export type StateSyncEvent = {
//   objectType: 'thread' | 'message' | 'participant'
//   mutationType: 'created' | 'updated' | 'deleted'
//   data: Partial<Thread> | Partial<Message> | Partial<Participant>
// }

export type ServerEvent =
  ThreadMessagesUpdatedEvent |
  ThreadMessagesAddedEvent |
  ThreadDeletedEvent |
  ThreadPropsUpdatedEvent |
  ParticipantTypingEvent |
  ParticipantStoppedTypingEvent |
  UserPresenceEvent

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
  isPinned?: boolean
  mutedUntil?: Date | 'forever'

  type: ThreadType
  timestamp: Date

  imgURL?: string
  createdAt?: Date
  description?: string
  lastMessageSnippet?: string

  messages: Paginated<Message>
  participants: Paginated<Participant>
}

export type ConnectionState = {
  status: ConnectionStatus
}

export type MessageSendOptions = {
  pendingMessageID?: string
  quotedMessageID?: string
}

export type LoginCreds = {
  cookieJarJSON?: CookieJar.Serialized
  jsCodeResult?: string
  username?: string
  password?: string
  code?: string
  lastLoginResult?: LoginResult
}

export type PresenceMap = { [userID: string]: UserPresence }

export type MessageContent = {
  text?: string
  filePath?: string
  fileBuffer?: Buffer
  fileName?: string
  mimeType?: string
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
  onLoginEvent?: (onEvent: Function) => Awaitable<void>
  onConnectionStateChange?: (onEvent: OnConnStateChangeCallback) => Awaitable<void>

  takeoverConflict?: () => Awaitable<void>

  searchUsers: (typed: string) => Awaitable<Participant[]>
  searchMessages?: (typed: string, beforeCursor?: string, threadID?: string) => Awaitable<Paginated<Message>>

  getPresence?: () => Awaitable<PresenceMap>

  getThreads: (inboxName: InboxName, beforeCursor?: string) => Awaitable<Paginated<Thread>>
  getMessages: (threadID: string, beforeCursor: string) => Awaitable<Paginated<Message>>
  getParticipants?: (threadID: string, beforeCursor: string) => Awaitable<Paginated<Participant>>

  createThread: (userIDs: string[], title?: string) => Awaitable<boolean | Thread>

  sendMessage?: (threadID: string, content: MessageContent, options?: MessageSendOptions) => Promise<boolean | Message[]>

  forwardMessage?: (threadID: string, messageID: string, threadIDs?: string[], userIDs?: string[]) => Promise<boolean>

  sendTypingIndicator: (threadID: string, typing?: boolean) => Awaitable<void>
  addReaction?: (threadID: string, messageID: string, reactionName: string) => Awaitable<any>
  removeReaction?: (threadID: string, messageID: string, reactionName: string) => Awaitable<any>
  deleteMessage?: (threadID: string, messageID: string, forEveryone?: boolean) => Awaitable<boolean>
  sendReadReceipt: (threadID: string, messageID: string) => Awaitable<any>

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
  loadDynamicMessage?: (message: Message) => Awaitable<Partial<Message>>
}

export type Reaction = {
  title: string
  render: string
}

type ReactComponent = React.ReactElement | (() => JSX.Element) | ((props: any) => JSX.Element)

export type Platform = {
  name: string
  version?: string
  displayName: string
  supportedReactions: Record<string, Reaction>
  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>
  icon: string | ReactComponent
  tags?: string[]

  loginMode: LoginMode
  browserLogin?: BrowserLogin
  auth?: ReactComponent | any

  maxGroupTitleLength?: number
  typingDurationMs?: number

  getUserProfileLink?: (participant: Participant) => string

  mapMessage: (...originalMsg: any) => Message

  extra?: any
}
