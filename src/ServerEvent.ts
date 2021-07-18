import type { ActivityType, ServerEventType } from './enums'
import type { Message, MessageReaction } from './Message'
import type { Thread } from './Thread'
import type { Participant } from './User'

/** @deprecated use `UserActivityEvent` instead */
export type ParticipantTypingEvent = {
  type: ServerEventType.PARTICIPANT_TYPING
  typing: boolean
  threadID: string
  participantID: string
  durationMs?: number
}

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
  lastActive: Date
}

export type PresenceMap = { [userID: string]: UserPresence }

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
  ParticipantTypingEvent |
  UserActivityEvent |
  UserPresenceEvent
