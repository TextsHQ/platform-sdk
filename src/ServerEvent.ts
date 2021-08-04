import type { ActivityType, ServerEventType } from './enums'
import type { Message, MessageReaction } from './Message'
import type { Thread } from './Thread'
import type { Participant } from './User'

export type UserActivityEvent = {
  type: ServerEventType.USER_ACTIVITY
  activityType: ActivityType
  threadID: string
  participantID: string
  durationMs?: number
  /** used when `activityType` is ActivityType.CUSTOM */
  customLabel?: string
}

export type UserPresence = {
  userID: string
  isActive: boolean
  lastActive?: Date
}

export type PresenceMap = { [userID: string]: UserPresence }

export type UserPresenceEvent = {
  type: ServerEventType.USER_PRESENCE_UPDATED
  presence: UserPresence
}

// type ObjectMutationType = 'upsert' | 'insert' | 'update' | 'delete'
type ObjectName = 'thread' | 'message' | 'message_reaction' | 'participant'

type PartialWithID<T> = { [P in keyof T]?: T[P] } & { id: string }

/** update or insert (upsert) some objects */
export type UpsertStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
    reactionID?: string
  }
  mutationType: 'upsert'
  objectName: ObjectName
  entries: Array<Thread | Message | Participant | MessageReaction>
}
/** update some objects */
export type UpdateStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
    reactionID?: string
  }
  mutationType: 'update'
  objectName: ObjectName
  entries: Array<PartialWithID<Thread> | PartialWithID<Message> | PartialWithID<Participant> | PartialWithID<MessageReaction>>
}
/** delete some objects */
export type DeleteStateSyncEvent = {
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
/** delete everything from some array */
export type DeleteAllStateSyncEvent = {
  type: ServerEventType.STATE_SYNC
  objectIDs: {
    threadID?: string
    messageID?: string
    reactionID?: string
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
  UserActivityEvent |
  UserPresenceEvent
