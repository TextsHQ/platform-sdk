import type { CookieJar } from 'tough-cookie'
import type { Readable } from 'stream'
import type { ActivityType, CodeRequiredReason, ConnectionStatus } from './enums'
import type { Size, Awaitable, Paginated, FSPath } from './generic'
import type { Message, MessageID, MessageLink } from './Message'
import type { PhoneNumber } from './PhoneNumber'
import type { PresenceMap, ServerEvent } from './ServerEvent'
import type { Thread, ThreadID } from './Thread'
import type { User, UserID, CurrentUser, Participant } from './User'
import type { ThreadFolderName } from './ThreadFolderName'
import type { NotificationsInfo } from './Notifications'

export type OnServerEventCallback = (events: ServerEvent[]) => void

export type OnConnStateChangeCallback = (state: ConnectionState) => void

export type MessageContent = {
  text?: string
  filePath?: FSPath
  fileBuffer?: Buffer
  fileName?: string

  mimeType?: string
  isGif?: boolean
  size?: Size
  isRecordedAudio?: boolean
  audioDurationSeconds?: number

  // string of participant IDs that were @-mentioned
  mentionedUserIDs?: UserID[]
}

export type MessageSendOptions = {
  /** random UUID for the sent message */
  pendingMessageID?: MessageID
  /** thread ID of the quoted message, should be null if same thread as this message */
  quotedMessageThreadID?: ThreadID
  /** message ID of the quoted message. also set `quotedMessageThreadID` if message belongs to a different thread */
  quotedMessageID?: MessageID
}

export type PaginationArg = {
  cursor: string
  direction: 'after' | 'before'
}

export type AccountInfo = {
  accountID: string
  dataDirPath: FSPath
}

export type ConnectionState = {
  status: ConnectionStatus
  canRetry?: boolean
}

export type LoginResult = {
  type: 'success' | 'code_required' | 'error' | 'wait'
  reason?: CodeRequiredReason
  metadata?: any
  title?: string
  errorMessage?: string
}

export type LoginCreds = {
  cookieJarJSON?: CookieJar.Serialized
  jsCodeResult?: string
  lastURL?: string
  username?: string
  password?: string
  code?: string
  custom?: any
  lastLoginResult?: LoginResult
}

export type FetchURL = string

export type FetchInfo = {
  url: string
  headers: Record<string, string>
}

export type AssetInfo = {
  /** Content-Length header to set */
  contentLength?: number
  /** Content-Type header to set */
  contentType?: string
}
export type Asset = AssetInfo & {
  data: FetchURL | FetchInfo | Buffer | Readable
}

export type SerializedSession = any

/**
 * { shortcode: url }
 * { "squirrel": "https://emoji.slack-edge.com/T01QMMLU7JL/squirrel/465f40c0e0.png" }
 */
export type CustomEmojiMap = { [shortcode: string]: string }

export type GetAssetOptions = {
  range?: { start: number, end: number }
}

// also modify relayer-constants.ts
export interface PlatformAPI {
  /**
   * Called after new PlatformAPI()
   * @param session - return value of `serializeSession`, `undefined` if not logged in
   */
  init: (session?: SerializedSession, accountInfo?: AccountInfo, prefs?: Record<string, boolean | string>) => Awaitable<void>

  /** `dispose` disconnects all network connections and cleans up. Called when user disables account and when app exits. */
  dispose: () => Awaitable<void>

  getCurrentUser: () => Awaitable<CurrentUser>

  login?: (creds?: LoginCreds) => Awaitable<LoginResult>
  /** `logout` logs out the user from the platform's servers, session should no longer be valid. Called when user clicks logout. */
  logout?: () => Awaitable<void>
  serializeSession?: () => Awaitable<SerializedSession>

  subscribeToEvents: (onEvent: OnServerEventCallback) => Awaitable<void>
  onLoginEvent?: (onEvent: Function) => Awaitable<void>
  onConnectionStateChange?: (onEvent: OnConnStateChangeCallback) => Awaitable<void>

  takeoverConflict?: () => Awaitable<void>

  searchUsers: (typed: string) => Awaitable<User[]>
  searchThreads?: (typed: string) => Awaitable<Thread[]>
  searchMessages?: (typed: string, pagination?: PaginationArg, threadID?: ThreadID) => Awaitable<Paginated<Message>>

  getPresence?: () => Awaitable<PresenceMap>
  getCustomEmojis?: () => Awaitable<CustomEmojiMap>

  getThreads: (folderName: ThreadFolderName, pagination?: PaginationArg) => Awaitable<Paginated<Thread>>
  /** Messages should be sorted by timestamp asc → desc */
  getMessages: (threadID: ThreadID, pagination?: PaginationArg) => Awaitable<Paginated<Message>>
  getThreadParticipants?: (threadID: ThreadID, pagination?: PaginationArg) => Awaitable<Paginated<Participant>>

  getThread?: (threadID: ThreadID) => Awaitable<Thread | undefined>
  getMessage?: (threadID: ThreadID, messageID: MessageID) => Awaitable<Message | undefined>
  getUser?: (ids: { userID?: UserID } | { username?: string } | { phoneNumber?: PhoneNumber } | { email?: string }) => Awaitable<User | undefined>

  createThread: (userIDs: UserID[], title?: string, messageText?: string) => Awaitable<boolean | Thread>
  updateThread?: (threadID: ThreadID, updates: Partial<Thread>) => Awaitable<void>
  deleteThread?: (threadID: ThreadID) => Awaitable<void>

  reportThread?: (type: 'spam', threadID: ThreadID, firstMessageID?: MessageID) => Awaitable<boolean>

  sendMessage?: (threadID: ThreadID, content: MessageContent, options?: MessageSendOptions) => Promise<boolean | Message[]>
  editMessage?: (threadID: ThreadID, messageID: MessageID, content: MessageContent, options?: MessageSendOptions) => Promise<boolean | Message[]>

  forwardMessage?: (threadID: ThreadID, messageID: MessageID, threadIDs?: ThreadID[], userIDs?: UserID[]) => Promise<void>

  sendActivityIndicator: (type: ActivityType, threadID?: ThreadID) => Awaitable<void>
  deleteMessage?: (threadID: ThreadID, messageID: MessageID, forEveryone?: boolean) => Awaitable<void>
  sendReadReceipt: (threadID: ThreadID, messageID: MessageID, messageCursor?: string) => Awaitable<void>

  addReaction?: (threadID: ThreadID, messageID: MessageID, reactionKey: string) => Awaitable<void>
  removeReaction?: (threadID: ThreadID, messageID: MessageID, reactionKey: string) => Awaitable<void>

  getLinkPreview?: (link: string) => Awaitable<MessageLink>

  addParticipant?: (threadID: ThreadID, participantID: UserID) => Awaitable<void>
  removeParticipant?: (threadID: ThreadID, participantID: UserID) => Awaitable<void>
  changeParticipantRole?: (threadID: ThreadID, participantID: UserID, role: 'admin' | 'regular') => Awaitable<void>

  changeThreadImage?: (threadID: ThreadID, imageBuffer: Buffer, mimeType: string) => Awaitable<void>

  markAsUnread?: (threadID: ThreadID, messageID?: MessageID) => Awaitable<void>
  archiveThread?: (threadID: ThreadID, archived: boolean) => Awaitable<void>
  pinThread?: (threadID: ThreadID, pinned: boolean) => Awaitable<void>
  notifyAnyway?: (threadID: ThreadID) => Awaitable<void>

  onThreadSelected?: (threadID: ThreadID) => Awaitable<void>
  loadDynamicMessage?: (message: Message) => Awaitable<Partial<Message>>

  // web: token = pushSubscription.toJSON()
  // apple: token = apns device token
  // android: token = FCM InstanceID token
  registerForPushNotifications?: (type: keyof NotificationsInfo, token: string) => Awaitable<void>
  unregisterForPushNotifications?: (type: keyof NotificationsInfo, token: string) => Awaitable<void>

  getAsset?: (fetchOptions?: GetAssetOptions, ...args: string[]) => Awaitable<FetchURL | FetchInfo | Buffer | Readable | Asset>
  /** `getAssetInfo` must be implemented if getAsset supports fetchOptions.range */
  getAssetInfo?: (fetchOptions?: GetAssetOptions, ...args: string[]) => Awaitable<AssetInfo>

  /** `getOriginalObject` returns the JSON representation of the original thread or message */
  getOriginalObject?: (objName: 'thread' | 'message', objectID: ThreadID | MessageID) => Awaitable<string>

  handleDeepLink?: (link: string) => void

  /** reconnect any websocket, mqtt or network connections since client thinks it's likely to have broken */
  reconnectRealtime?: () => void
}
