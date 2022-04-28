import type { CookieJar } from 'tough-cookie'
import type { Readable } from 'stream'
import type { ActivityType, CodeRequiredReason, ConnectionStatus } from './enums'
import type { Size, Awaitable, Paginated } from './generic'
import type { Message, MessageLink } from './Message'
import type { PhoneNumber } from './PhoneNumber'
import type { PresenceMap, ServerEvent } from './ServerEvent'
import type { Thread } from './Thread'
import type { User, CurrentUser, Participant } from './User'
import type { ThreadFolderName } from './ThreadFolderName'

export type OnServerEventCallback = (events: ServerEvent[]) => void

export type OnConnStateChangeCallback = (state: ConnectionState) => void

export type MessageContent = {
  text?: string
  filePath?: string
  fileBuffer?: Buffer
  fileName?: string

  mimeType?: string
  isGif?: boolean
  size?: Size
  isRecordedAudio?: boolean
  audioDurationSeconds?: number

  // string of participant IDs that were @-mentioned
  mentionedUserIDs?: string[]
}

export type MessageSendOptions = {
  /** random UUID for the sent message */
  pendingMessageID?: string
  /** thread ID of the quoted message, should be null if same thread as this message */
  quotedMessageThreadID?: string
  /** message ID of the quoted message. also set `quotedMessageThreadID` if message belongs to a different thread */
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
  init: (session?: SerializedSession, accountInfo?: AccountInfo, prefs?: Record<string, any>) => Awaitable<void>

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
  searchMessages?: (typed: string, pagination?: PaginationArg, threadID?: string) => Awaitable<Paginated<Message>>

  getPresence?: () => Awaitable<PresenceMap>
  getCustomEmojis?: () => Awaitable<CustomEmojiMap>

  getThreads: (folderName: ThreadFolderName, pagination?: PaginationArg) => Awaitable<Paginated<Thread>>
  /** Messages should be sorted by timestamp asc → desc */
  getMessages: (threadID: string, pagination?: PaginationArg) => Awaitable<Paginated<Message>>
  getThreadParticipants?: (threadID: string, pagination?: PaginationArg) => Awaitable<Paginated<Participant>>

  getThread?: (threadID: string) => Awaitable<Thread>
  getMessage?: (messageID: string) => Awaitable<Message>
  getUser?: (ids: { userID?: string } | { username?: string } | { phoneNumber?: PhoneNumber } | { email?: string }) => Awaitable<User | undefined>

  createThread: (userIDs: string[], title?: string, messageText?: string) => Awaitable<boolean | Thread>
  updateThread?: (threadID: string, updates: Partial<Thread>) => Awaitable<void | boolean>
  deleteThread?: (threadID: string) => Awaitable<void>

  reportThread?: (type: 'spam', threadID: string, firstMessageID?: string) => Awaitable<boolean>

  sendMessage?: (threadID: string, content: MessageContent, options?: MessageSendOptions) => Promise<boolean | Message[]>
  editMessage?: (threadID: string, messageID: string, content: MessageContent, options?: MessageSendOptions) => Promise<boolean | Message[]>

  forwardMessage?: (threadID: string, messageID: string, threadIDs?: string[], userIDs?: string[]) => Promise<void | boolean>

  sendActivityIndicator: (type: ActivityType, threadID?: string) => Awaitable<void>
  deleteMessage?: (threadID: string, messageID: string, forEveryone?: boolean) => Awaitable<void | boolean>
  sendReadReceipt: (threadID: string, messageID: string, messageCursor?: string) => Awaitable<void | boolean>

  addReaction?: (threadID: string, messageID: string, reactionKey: string) => Awaitable<void>
  removeReaction?: (threadID: string, messageID: string, reactionKey: string) => Awaitable<void>

  getLinkPreview?: (link: string) => Awaitable<MessageLink>

  addParticipant?: (threadID: string, participantID: string) => Awaitable<void | boolean>
  removeParticipant?: (threadID: string, participantID: string) => Awaitable<void | boolean>
  changeParticipantRole?: (threadID: string, participantID: string, role: string) => Awaitable<void | boolean>

  changeThreadImage?: (threadID: string, imageBuffer: Buffer, mimeType: string) => Awaitable<void>

  markAsUnread?: (threadID: string, messageID?: string) => Awaitable<void>
  archiveThread?: (threadID: string, archived: boolean) => Awaitable<void>
  pinThread?: (threadID: string, pinned: boolean) => Awaitable<void>
  notifyAnyway?: (threadID: string) => Awaitable<void>

  onThreadSelected?: (threadID: string) => Awaitable<void>
  loadDynamicMessage?: (message: Message) => Awaitable<Partial<Message>>

  /** `registerForPushNotifications` secret is the encryption key used for notifications */
  registerForPushNotifications?: (deviceToken: string, secret?: Buffer) => Awaitable<boolean>
  unregisterForPushNotifications?: (deviceToken: string) => Awaitable<boolean>

  getAsset?: (fetchOptions?: GetAssetOptions, ...args: string[]) => Awaitable<FetchURL | FetchInfo | Buffer | Readable | Asset>
  /** `getAssetInfo` must be implemented if getAsset supports fetchOptions.range */
  getAssetInfo?: (fetchOptions?: GetAssetOptions, ...args: string[]) => Awaitable<AssetInfo>

  /** `getOriginalObject` returns the JSON representation of the original thread or message */
  getOriginalObject?: (objName: 'thread' | 'message', objectID: string) => Awaitable<string>

  handleDeepLink?: (link: string) => void

  /** reconnect any websocket, mqtt or network connections since client thinks it's likely to have broken */
  reconnectRealtime?: () => void
}
