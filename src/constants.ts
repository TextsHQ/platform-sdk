import type { PlatformAPI } from './types'

export const UNKNOWN_DATE = new Date(1)

type FuncMetadata = {
  cacheable?: boolean
}

export const PlatformAPIFuncMetadata: Record<keyof PlatformAPI, FuncMetadata> = {
  init: {},
  dispose: {},

  getCurrentUser: {
    cacheable: true,
  },

  login: {},
  logout: {},
  serializeSession: {},

  subscribeToEvents: {},
  onLoginEvent: {},
  onConnectionStateChange: {},

  takeoverConflict: {},

  searchUsers: {
    cacheable: true,
  },
  searchMessages: {
    cacheable: true,
  },

  getPresence: {},

  getThreads: {
    cacheable: true,
  },
  getMessages: {
    cacheable: true,
  },
  getParticipants: {
    cacheable: true,
  },

  createThread: {},
  deleteThread: {},

  sendMessage: {},

  forwardMessage: {},

  sendActivityIndicator: {},
  deleteMessage: {},
  sendReadReceipt: {},

  addReaction: {},
  removeReaction: {},

  getLinkPreview: {},

  addParticipant: {},
  removeParticipant: {},
  changeParticipantRole: {},

  changeThreadTitle: {},
  changeThreadImage: {},

  markAsUnread: {},
  archiveThread: {},
  muteThread: {},
  pinThread: {},

  onThreadSelected: {},

  loadDynamicMessage: {
    cacheable: true,
  },

  getAsset: {
    cacheable: true,
  },
}
