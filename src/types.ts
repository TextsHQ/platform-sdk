import type { CookieJar } from 'tough-cookie'
import type { MessageActionType, MessageAttachmentType, MessageDeletionMode, Attribute, CodeRequiredReason, InboxName, ServerEventType, ConnectionStatus, ActivityType } from './enums'

export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]
  ?
  : never
}
export type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

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
  reactionKey: string
  participantID: string
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

export type LoginMode = 'browser' | 'manual' | 'custom'

export type LoginResult = {
  type: 'success' | 'code_required' | 'error' | 'wait'
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

export type MessagePreview = Pick<Message, 'id' | 'text' | 'senderID' | 'attachments'>

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

export type TextEntity = {
  from: number
  to: number

  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  pre?: boolean
  codeLanguage?: string

  replaceWith?: string
  link?: string
  mentionedUser?: XOR<{ username: string }, { id: string }>
}

export type MessageButton = {
  label: string
  linkURL: string
}

export type TextAttributes = {
  entities?: TextEntity[]
  /**
   * decode HTML entities like > (&gt;)
   */
  heDecode?: boolean
}

export type Message = {
  _original?: string
  id: string
  textHeading?: string
  textFooter?: string
  text: string
  textAttributes?: TextAttributes
  timestamp: Date
  editedTimestamp?: Date
  expiresInSeconds?: number
  senderID: 'none' | '$thread' | string

  attachments: MessageAttachment[]
  tweet?: Tweet
  links?: MessageLink[]
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
  /**
   * `silent` messages will not mark the thread as unread, move the thread to the top of the list, or show a notification
   */
  silent?: boolean
  linkedMessageID?: string
  linkedMessage?: MessagePreview
  action?: MessageAction
  cursor?: string
  buttons?: MessageButton[]

  extra?: any

  threadID?: string
  // sender?: Participant
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

// type ObjectMutationType = 'upsert' | 'insert' | 'update' | 'delete'
type ObjectName = 'thread' | 'message' | 'message_reaction' | 'participant'

export type StateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
    reactionID?: string
  }
  mutationType: 'upsert'
  objectName: ObjectName
  entries: Array<Thread | Message | Participant | MessageReaction>
} | {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
    reactionID?: string
  }
  mutationType: 'update'
  objectName: ObjectName
  entries: Array<Partial<Thread> | Partial<Message> | Partial<Participant> | Partial<MessageReaction>>
} | {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
    reactionID?: string
  }
  mutationType: 'delete'
  objectName: ObjectName
  entries: string[]
}

export type ThreadMessagesRefreshEvent = {
  type: ServerEventType.THREAD_MESSAGES_REFRESH
  threadID: string
}

export type ThreadTrustedEvent = {
  type: ServerEventType.THREAD_TRUSTED
  threadID: string
}

export type ToastEvent = {
  type: ServerEventType.TOAST
  toast: {
    text: string
  }
}

export type ServerEvent =
  StateSyncEvent |
  ToastEvent |
  ThreadMessagesRefreshEvent |
  ThreadTrustedEvent |
  ParticipantTypingEvent |
  UserPresenceEvent

export type OnServerEventCallback = (event: ServerEvent[]) => void

export type OnConnStateChangeCallback = (state: ConnectionState) => void

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
  canRetry?: boolean
}

export type LoginCreds = {
  cookieJarJSON?: CookieJar.Serialized
  jsCodeResult?: string
  username?: string
  password?: string
  code?: string
  custom?: any
  lastLoginResult?: LoginResult
}

export type PresenceMap = { [userID: string]: UserPresence }

export type MessageContent = {
  text?: string
  filePath?: string
  fileBuffer?: Buffer
  fileName?: string

  mimeType?: string
  isGif?: boolean
  isRecordedAudio?: boolean
  audioDurationSeconds?: number
}

export type MessageSendOptions = {
  pendingMessageID?: string
  quotedMessageID?: string
}

export type PaginationArg = {
  cursor: string
  direction: 'after' | 'before'
}

export type AccountInfo = {
  accountID: string
  dataDirPath: string
}

// also modify relayer-constants.ts
export interface PlatformAPI {
  init: (session?: any, accountInfo?: AccountInfo) => Awaitable<void>
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
  searchMessages?: (typed: string, pagination?: PaginationArg, threadID?: string) => Awaitable<Paginated<Message>>

  getPresence?: () => Awaitable<PresenceMap>

  getThreads: (inboxName: InboxName, pagination?: PaginationArg) => Awaitable<Paginated<Thread>>
  getMessages: (threadID: string, pagination?: PaginationArg) => Awaitable<Paginated<Message>>
  getParticipants?: (threadID: string, pagination?: PaginationArg) => Awaitable<Paginated<Participant>>

  createThread: (userIDs: string[], title?: string) => Awaitable<boolean | Thread>
  deleteThread?: (threadID: string) => Awaitable<void>

  sendMessage?: (threadID: string, content: MessageContent, options?: MessageSendOptions) => Promise<boolean | Message[]>

  forwardMessage?: (threadID: string, messageID: string, threadIDs?: string[], userIDs?: string[]) => Promise<boolean>

  sendActivityIndicator: (type: ActivityType, threadID: string) => Awaitable<void>
  deleteMessage?: (threadID: string, messageID: string, forEveryone?: boolean) => Awaitable<boolean>
  sendReadReceipt: (threadID: string, messageID: string) => Awaitable<any>

  addReaction?: (threadID: string, messageID: string, reactionKey: string) => Awaitable<any>
  removeReaction?: (threadID: string, messageID: string, reactionKey: string) => Awaitable<any>

  getLinkPreview?: (link: string) => Promise<MessageLink>

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

  getAsset?: (...args: string[]) => Awaitable<string | Buffer>
}

export type SupportedReaction = {
  title: string
  render: string
  disabled?: boolean
}

type ReactComponent = React.ReactNode | (() => JSX.Element) | ((props: any) => JSX.Element)

export type PlatformInfo = {
  name: string
  version?: string
  displayName: string
  icon: string | ReactComponent
  tags?: string[]

  loginMode: LoginMode
  browserLogin?: BrowserLogin
  auth?: ReactComponent | any

  reactions?: {
    supported: Record<string, SupportedReaction>
    supportsDynamicReactions?: boolean
    canReactWithAllEmojis?: boolean
    allowsMultipleReactionsToSingleMessage?: boolean
  }
  deletionMode: MessageDeletionMode
  attributes: Set<Attribute>

  maxGroupTitleLength?: number
  typingDurationMs?: number
  attachments?: {
    noSupport?: boolean
    noSupportForImage?: boolean
    noSupportForVideo?: boolean
    noSupportForAudio?: boolean
    noSupportForFiles?: boolean
    supportsCaption?: boolean
    recordedAudioMimeType?: string
    gifMimeType?: string
  }

  extra?: any

  getUserProfileLink?: (participant: Participant) => string
  mapMessage?: (...originalMsg: any) => Message
}

export interface Platform {
  info: PlatformInfo
  api: PlatformAPI
}
