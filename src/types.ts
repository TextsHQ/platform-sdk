import type { CookieJar } from 'tough-cookie'
import type React from 'react'
import type { MessageActionType, MessageAttachmentType, MessageDeletionMode, Attribute, CodeRequiredReason, InboxName, ServerEventType, ConnectionStatus } from './enums'

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

export type MessageReaction = {
  id: string
  reactionName: string
  participantID: string
}

export type ThreadTitleUpdatedAction = { type: MessageActionType.THREAD_TITLE_UPDATED, title: string, actorParticipantID: string }
export type ThreadParticipantsAddedAction = { type: MessageActionType.THREAD_PARTICIPANTS_ADDED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type ThreadParticipantsRemovedAction = { type: MessageActionType.THREAD_PARTICIPANTS_REMOVED, participantIDs: string[], actorParticipantID: string, participants?: Participant[] }
export type GroupThreadCreatedAction = { type: MessageActionType.GROUP_THREAD_CREATED, title: string, actorParticipantID: string }
export type MessageRequestAcceptedAction = { type: MessageActionType.MESSAGE_REQUEST_ACCEPTED }

export type MessageReactionCreatedAction = { type: MessageActionType.MESSAGE_REACTION_CREATED, messageID?: string } & Partial<MessageReaction>
export type MessageReactionDeletedAction = { type: MessageActionType.MESSAGE_REACTION_DELETED, messageID?: string } & Partial<MessageReaction>

export type MessageAction =
  ThreadTitleUpdatedAction |
  ThreadParticipantsAddedAction |
  ThreadParticipantsRemovedAction |
  GroupThreadCreatedAction |
  MessageRequestAcceptedAction |
  MessageReactionCreatedAction |
  MessageReactionDeletedAction

export type MessageSeen =
  boolean | Date | // for single threads
  { [participantID: string]: Date } // for group threads

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
  action?: MessageAction

  extra?: any

  threadID?: string
  sender?: Participant
}

export type UserPresence = {
  userID: string
  isActive: boolean
  lastActive: Date
}

export type ParticipantTypingEvent = {
  type: ServerEventType.PARTICIPANT_TYPING
  typing: boolean
  threadID: string
  participantID: string
  durationMs?: number
}

export type UserPresenceEvent = {
  type: ServerEventType.USER_PRESENCE_UPDATED
  presence: UserPresence
}

type ObjectMutationType = 'created' | 'updated' | 'deleted'
type ObjectName = 'thread' | 'message' | 'message_reaction' | 'participant'

export type StateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectID: string[]
  mutationType: ObjectMutationType
  objectName: ObjectName
  data?: Partial<Thread> | Partial<Message> | Partial<Participant> | Partial<MessageReaction>
}

export type ThreadMessagesRefreshEvent = {
  type: ServerEventType.THREAD_MESSAGES_REFRESH
  threadID: string
}

export type ServerEvent =
  StateSyncEvent |
  ThreadMessagesRefreshEvent |
  ParticipantTypingEvent |
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

  searchUsers: (typed: string) => Awaitable<User[]>
  searchMessages?: (typed: string, beforeCursor?: string, threadID?: string) => Awaitable<Paginated<Message>>

  getPresence?: () => Awaitable<PresenceMap>

  getThreads: (inboxName: InboxName, beforeCursor?: string) => Awaitable<Paginated<Thread>>
  getMessages: (threadID: string, beforeCursor: string) => Awaitable<Paginated<Message>>
  getParticipants?: (threadID: string, beforeCursor: string) => Awaitable<Paginated<Participant>>

  createThread: (userIDs: string[], title?: string) => Awaitable<boolean | Thread>
  deleteThread?: (threadID: string) => Awaitable<void>

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

  getAsset?: (key: string) => Awaitable<string | Buffer>
}

export type Reaction = {
  title: string
  render: string
  disabled?: boolean
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

  mapMessage?: (...originalMsg: any) => Message

  extra?: any
}
