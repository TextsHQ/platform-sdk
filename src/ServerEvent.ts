import type { CookieJar } from 'tough-cookie'
import type { CustomEmoji } from './CustomEmoji'
import type { ActivityType, ServerEventType } from './enums'
import type { PartialWithID } from './generic'
import type { Message, MessageReaction } from './Message'
import type { Thread } from './Thread'
import type { Participant } from './User'

export type UserActivityEvent = {
  type: ServerEventType.USER_ACTIVITY
  activityType: ActivityType
  threadID: string
  participantID: string
  /** ttl */
  durationMs?: number
  /** used when `activityType` is ActivityType.CUSTOM */
  customLabel?: string
}

export type UserPresence = {
  userID: string
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

// type ObjectMutationType = 'upsert' | 'insert' | 'update' | 'delete'
type ObjectName = 'thread' | 'message' | 'message_reaction' | 'participant' | 'custom_emoji'

/** update or insert (upsert) some objects */
export type UpsertStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
  }
  mutationType: 'upsert'
  objectName: ObjectName
  entries: Array<Thread | Message | Participant | MessageReaction | CustomEmoji>
}
/** update some objects */
export type UpdateStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
  }
  mutationType: 'update'
  objectName: ObjectName
  entries: Array<PartialWithID<Thread> | PartialWithID<Message> | PartialWithID<Participant> | PartialWithID<MessageReaction> | PartialWithID<CustomEmoji>>
}
/** delete some objects */
export type DeleteStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
  }
  mutationType: 'delete'
  objectName: ObjectName
  entries: string[]
}
/** delete everything from some array */
export type DeleteAllStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
  }
  mutationType: 'delete-all'
  objectName: ObjectName
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
  threadID: string
}
export type ThreadMessagesRefreshAllEvent = {
  type: ServerEventType.THREAD_MESSAGES_REFRESH_ALL
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
  ThreadMessagesRefreshAllEvent |
  ThreadTrustedEvent |
  ToastEvent |
  OpenWindowEvent |
  UserActivityEvent |
  UserPresenceEvent
