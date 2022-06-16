import type { CookieJar } from 'tough-cookie'
import type { CustomEmoji } from './CustomEmoji'
import type { ActivityType, ServerEventType } from './enums'
import type { PartialWithID } from './generic'
import type { Message, MessageID, MessageReaction } from './Message'
import type { Thread, ThreadID } from './Thread'
import type { Participant, UserID } from './User'

export type UserActivityEvent = {
  type: ServerEventType.USER_ACTIVITY
  activityType: ActivityType
  threadID: ThreadID
  participantID: UserID
  /** ttl */
  durationMs?: number
  /** used when `activityType` is ActivityType.CUSTOM */
  customLabel?: string
}

export type UserPresence = {
  userID: UserID
  status: 'online' | 'offline' | 'dnd' | 'dnd_can_notify' | 'idle' | 'invisible' | 'custom'
  /** used when `status` is custom */
  customStatus?: string
  lastActive?: Date
  /** ttl (how long should this status be active) */
  durationMs?: number
}

export type PresenceMap = { [userID: string]: UserPresence }

export type UserPresenceEvent = {
  type: ServerEventType.USER_PRESENCE_UPDATED
  presence: UserPresence
}

type ObjectName = 'thread' | 'message' | 'message_reaction' | 'participant' | 'custom_emoji'
type Object = Thread | Message | Participant | MessageReaction | CustomEmoji
type StateSyncEventBase = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: ThreadID
    messageID?: MessageID
  }
  objectName: ObjectName
}
/** update or insert (upsert) some objects */
export type UpsertStateSyncEvent = StateSyncEventBase & {
  mutationType: 'upsert'
  entries: Array<Object>
}
/** update some objects */
export type UpdateStateSyncEvent = StateSyncEventBase & {
  mutationType: 'update'
  entries: Array<PartialWithID<Object>>
}
/** delete some objects */
export type DeleteStateSyncEvent = StateSyncEventBase & {
  mutationType: 'delete'
  entries: string[]
}
/** delete everything from some array */
export type DeleteAllStateSyncEvent = StateSyncEventBase & {
  mutationType: 'delete-all'
}

export type StateSyncEvent =
  UpsertStateSyncEvent |
  UpdateStateSyncEvent |
  DeleteStateSyncEvent |
  DeleteAllStateSyncEvent

/**
 * Requests client to call `getMessages(threadID, undefined)` to update the latest n messages
 * If the thread doesn't exist, client calls `getThreads`
 * This event exists to get started quickly, you should almost always use `StateSyncEvent` instead
 * */
export type ThreadMessagesRefreshEvent = {
  type: ServerEventType.THREAD_MESSAGES_REFRESH
  threadID: ThreadID
}
export type SessionUpdatedEvent = {
  type: ServerEventType.SESSION_UPDATED
}

export type ThreadTrustedEvent = {
  type: ServerEventType.THREAD_TRUSTED
  threadID: ThreadID
}

export type ToastEvent = {
  type: ServerEventType.TOAST
  toast: {
    /** random ID of the toast, can be used to update the same toast */
    id?: string
    text: string
    /** how long should the toast be displayed */
    timeoutMs?: number
  }
}

export type OpenWindowEvent = {
  type: ServerEventType.OPEN_WINDOW
  url?: string
  windowTitle?: string
  windowWidth?: number
  windowHeight?: number
  cookieJar?: CookieJar.Serialized
}

export type ServerEvent =
  StateSyncEvent |
  ThreadMessagesRefreshEvent |
  SessionUpdatedEvent |
  ThreadTrustedEvent |
  ToastEvent |
  OpenWindowEvent |
  UserActivityEvent |
  UserPresenceEvent
