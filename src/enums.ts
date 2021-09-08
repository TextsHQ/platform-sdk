export enum InboxName {
  NORMAL = 'normal',
  REQUESTS = 'requests',
}

export enum Attribute {
  /** Platform users can have an email address */
  CAN_MESSAGE_EMAIL = 'can_message_email',
  /** Platform users can have a phone number */
  CAN_MESSAGE_PHONE_NUMBER = 'can_message_phone_number',
  /** Platform users can have a username */
  CAN_MESSAGE_USERNAME = 'can_message_username',
  /** Don't cache messages, threads, users for the platform */
  NO_CACHE = 'no_cache',

  /** Platform defines Message.cursor. If it's missing for any message, error checker plugin will complain. */
  DEFINES_MESSAGE_CURSOR = 'defines_message_cursor',

  /** When it's a group thread and user does an @-mention, search all users in the autocomplete */
  SEARCH_ALL_USERS_FOR_GROUP_MENTIONS = 'search_all_users_for_group_mentions',

  /** Platform doesn't allow creation of duplicate groups with the same set of users (Alice, Bob) */
  NO_SUPPORT_DUPLICATE_GROUP_CREATION = 'no_support_duplicate_group_creation',
  /** Platform integration doesn't support adding participants to groups */
  NO_SUPPORT_GROUP_ADD_PARTICIPANT = 'no_support_group_add_participant',
  /** Platform integration doesn't support removing participants from groups */
  NO_SUPPORT_GROUP_REMOVE_PARTICIPANT = 'no_support_group_remove_participant',
  /** Platform integration doesn't support creating group threads */
  NO_SUPPORT_GROUP_THREAD_CREATION = 'no_support_group_thread_creation',
  /** Platform integration doesn't support changing group titles */
  NO_SUPPORT_GROUP_TITLE_CHANGE = 'no_support_group_title_change',
  /** Platform integration doesn't support creating single threads */
  NO_SUPPORT_SINGLE_THREAD_CREATION = 'no_support_single_thread_creation',
  /** Platform integration doesn't support sending typing indicator */
  NO_SUPPORT_TYPING_INDICATOR = 'no_support_typing_indicator',

  SHARES_CONTACTS = 'shares_contacts',
  /** Sort messages by timestamp or custom key on receiving them */
  SORT_MESSAGES_ON_PUSH = 'sort_messages_on_push',
  SUBSCRIBE_TO_CONN_STATE_CHANGE = 'subscribe_to_conn_state_change',
  SUBSCRIBE_TO_THREAD_SELECTION = 'subscribe_to_thread_selection',

  SUPPORTS_ARCHIVE = 'supports_archive',
  /** Platform supports reacting with custom emojis and sending custom emojis in Message.text
   *  and platform integration implements PlatformAPI.getCustomEmojis */
  SUPPORTS_CUSTOM_EMOJIS = 'supports_custom_emojis',
  SUPPORTS_DELETE_THREAD = 'supports_delete_thread',
  /** Platform integration implements PlatformAPI.editMessage */
  SUPPORTS_EDIT_MESSAGE = 'supports_edit_message',
  SUPPORTS_FORWARD = 'supports_forward',
  SUPPORTS_GROUP_IMAGE_CHANGE = 'supports_group_image_change',
  SUPPORTS_GROUP_PARTICIPANT_ROLE_CHANGE = 'supports_group_participant_role_change',
  SUPPORTS_MARK_AS_UNREAD = 'supports_mark_as_unread',
  SUPPORTS_PIN_THREAD = 'supports_pin_thread',
  SUPPORTS_PRESENCE = 'supports_presence',
  SUPPORTS_QUOTED_MESSAGES = 'supports_quoted_messages',
  SUPPORTS_QUOTED_MESSAGES_FROM_ANY_THREAD = 'supports_quoted_messages_from_any_thread',
  SUPPORTS_REQUESTS_INBOX = 'supports_requests_inbox',
  SUPPORTS_SEARCH = 'supports_search',
  SUPPORTS_STOP_TYPING_INDICATOR = 'supports_stop_typing_indicator',

  /** Platform integration implements editMessage() and has no rate limit for message edits */
  SUPPORTS_LIVE_TYPING = 'supports_live_typing',
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
  TOAST = 'toast',
  THREAD_MESSAGES_REFRESH = 'thread_messages_refresh',
  THREAD_MESSAGES_REFRESH_ALL = 'thread_messages_refresh_all',
  THREAD_TRUSTED = 'thread_trusted',
  /** @deprecated use `USER_ACTIVITY` instead */
  PARTICIPANT_TYPING = 'participant_typing',
  USER_ACTIVITY = 'user_activity',
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
  CUSTOM = 'custom',
  RECORDING_VOICE = 'recording_voice',
  RECORDING_VIDEO = 'recording_video',
}

export enum MessageBehavior {
  /** keep the thread read, don't move the thread to the top of the list, don't show a notification */
  SILENT = 'silent',
  /** keep the thread read, don't show a notification */
  KEEP_READ = 'keep_read',
  /** don't show a notification */
  DONT_NOTIFY = 'dont_notify',
}
