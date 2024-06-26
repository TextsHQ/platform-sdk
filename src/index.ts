import type { TextsNodeGlobals, TextsRendererGlobals } from './TextsGlobals'

export * from './enums'
export * from './errors'
export * from './constants'

export * from './fetch'
export * from './generic'
export * from './CustomEmoji'
export * from './Message'
export * from './Attachment'
export * from './Notifications'
export * from './PhoneNumber'
export * from './Platform'
export * from './PlatformAPI'
export * from './PlatformInfo'
export * from './ServerEvent'
export * from './TextAttributes'
export * from './Thread'
export * from './ThreadFolderName'
export * from './User'
export * from './StickerPack'
export * from './IAsyncSqlite'
export * from './util'

export const texts = (globalThis as any).texts as TextsNodeGlobals
export const textsRenderer = (globalThis as any).texts as TextsRendererGlobals
