export enum InboxName {
  NORMAL = 'normal',
  REQUESTS = 'requests',
}

export enum Attribute {
  CAN_MESSAGE_EMAIL = 'can_message_email',
  CAN_MESSAGE_PHONE_NUMBER = 'can_message_phone_number',
  CAN_MESSAGE_USERNAME = 'can_message_username',
  NO_CACHE = 'no_cache',
  NO_SUPPORT_DUPLICATE_GROUP_CREATION = 'no_support_duplicate_group_creation',
  NO_SUPPORT_GROUP_ADD_PARTICIPANT = 'no_support_group_add_participant',
  NO_SUPPORT_GROUP_REMOVE_PARTICIPANT = 'no_support_group_remove_participant',
  NO_SUPPORT_GROUP_THREAD_CREATION = 'no_support_group_thread_creation',
  NO_SUPPORT_GROUP_TITLE_CHANGE = 'no_support_group_title_change',
  NO_SUPPORT_SINGLE_THREAD_CREATION = 'no_support_single_thread_creation',
  NO_SUPPORT_TYPING_INDICATOR = 'no_support_typing_indicator',
  SHARES_CONTACTS = 'shares_contacts',
  SORT_MESSAGES_ON_PUSH = 'sort_messages_on_push',
  SUBSCRIBE_TO_CONN_STATE_CHANGE = 'subscribe_to_conn_state_change',
  SUBSCRIBE_TO_THREAD_SELECTION = 'subscribe_to_thread_selection',
  SUPPORTS_ARCHIVE = 'supports_archive',
  SUPPORTS_FORWARD = 'supports_forward',
  SUPPORTS_GROUP_IMAGE_CHANGE = 'supports_group_image_change',
  SUPPORTS_GROUP_PARTICIPANT_ROLE_CHANGE = 'supports_group_participant_role_change',
  SUPPORTS_MARK_AS_UNREAD = 'supports_mark_as_unread',
  SUPPORTS_PIN_THREAD = 'supports_pin_thread',
  SUPPORTS_PRESENCE = 'supports_presence',
  SUPPORTS_QUOTED_MESSAGES = 'supports_quoted_messages',
  SUPPORTS_REQUESTS_INBOX = 'supports_requests_inbox',
  SUPPORTS_SEARCH = 'supports_search',
  SUPPORTS_STOP_TYPING_INDICATOR = 'supports_stop_typing_indicator',
}

export enum MessageActionType {
  GROUP_THREAD_CREATED = 'group_thread_created',
  THREAD_IMG_CHANGED = 'thread_img_changed',
  THREAD_TITLE_UPDATED = 'thread_title_updated',
  THREAD_PARTICIPANTS_ADDED = 'thread_participants_added',
  THREAD_PARTICIPANTS_REMOVED = 'thread_participants_removed',
  MESSAGE_REQUEST_ACCEPTED = 'message_request_accepted',
  MESSAGE_REACTION_CREATED = 'message_reaction_created',
  MESSAGE_REACTION_DELETED = 'message_reaction_deleted',
}

export enum ServerEventType {
  STATE_SYNC = 'state_sync',
  THREAD_MESSAGES_REFRESH = 'thread_messages_refresh',
  THREAD_TRUSTED = 'thread_trusted',
  PARTICIPANT_TYPING = 'participant_typing',
  USER_PRESENCE_UPDATED = 'user_presence_updated',
}

export enum CodeRequiredReason {
  TWO_FACTOR = 'two_factor',
  CHECKPOINT = 'checkpoint',
}

export enum MessageDeletionMode {
  DELETE_FOR_SELF = 'delete_for_self',
  DELETE_FOR_EVERYONE = 'delete_for_everyone',
  UNSEND = 'unsend',
  UNSUPPORTED = 'unsupported',
  NONE = 'none',
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

export enum ActivityType {
  NONE = 'none',
  TYPING = 'typing',
  RECORDING_VOICE = 'recording_voice',
  RECORDING_VIDEO = 'recording_video',
}
