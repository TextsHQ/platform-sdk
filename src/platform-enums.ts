export enum InboxName {
  NORMAL = 'normal',
  REQUESTS = 'requests',
}

export enum Attribute {
  NO_SUPPORT_GROUP_THREAD_CREATION,
  NO_SUPPORT_SINGLE_THREAD_CREATION,
  NO_SUPPORT_TYPING_INDICATOR,
  NO_SUPPORT_GROUP_TITLE_CHANGE,
  SUBSCRIBE_TO_THREAD_SELECTION,
  SEARCH_USERS_IN_CONTACTS,
  SUPPORTS_SEARCH,
  SUPPORTS_QUOTED_MESSAGES,
  SUPPORTS_ARCHIVE,
  SUPPORTS_PIN_THREAD,
  SUPPORTS_STOP_TYPING_INDICATOR,
  SUPPORTS_REQUESTS_INBOX,
}

export enum ThreadActionType {
  GROUP_THREAD_CREATED = 'group_thread_created',
  THREAD_TITLE_UPDATED = 'thread_title_updated',
  THREAD_PARTICIPANTS_ADDED = 'thread_participants_added',
  THREAD_PARTICIPANTS_REMOVED = 'thread_participants_removed',
  MESSAGE_REQUEST_ACCEPTED = 'message_request_accepted',
}

export enum ServerEventType {
  THREAD_UPDATED = 'thread_updated',
  THREAD_READ = 'thread_read',
  PARTICIPANT_TYPING = 'participant_typing',
  PARTICIPANT_STOPPED_TYPING = 'participant_stopped_typing',
}

export enum CodeRequiredReason {
  TWO_FACTOR,
  CHECKPOINT,
}

export enum MessageDeletionMode {
  DELETE_FOR_SELF,
  DELETE_FOR_EVERYONE,
  UNSEND,
  UNSUPPORTED,
  NONE,
}

export enum MessageAttachmentType {
  UNKNOWN = 'unknown',
  IMG = 'img',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum ConnectionStatus {
  UNKNOWN = 'unknown',
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  CONFLICT = 'conflict',
  UNAUTHORIZED = 'unauthorized',
  DISCONNECTED = 'disconnected',
}

export enum RightPaneView {
  THREAD = 'thread',
  PREFS = 'prefs',
}
