import type { TextsGlobals } from './TextsGlobals'

export * from './enums'
export * from './errors'
export * from './constants'

export * from './fetch'
export * from './generic'
export * from './CustomEmoji'
export * from './Message'
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
export * from './IAsyncSqlite'

export const texts = (globalThis as any).texts as TextsGlobals
